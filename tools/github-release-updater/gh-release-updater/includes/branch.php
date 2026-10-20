<?php
/**
 * "Live branch" mode: follow the files of a branch instead of a release.
 *
 * Push to the branch on GitHub and the site notices (checked every 15 minutes). Only the files that changed are
 * downloaded: the new package is built from the files you already have plus the differences, and WordPress installs
 * it with its normal updater (maintenance mode, replace, reactivate, automatic rollback of a broken plugin).
 * No webhook or other address is opened on the site for GitHub to call.
 *
 * @package GH_Release_Updater
 */

defined( 'ABSPATH' ) || exit;

/** Request headers for the GitHub API. */
function ghru_headers( $src, $accept = 'application/vnd.github+json' ) {
	$h = array( 'Accept' => $accept, 'User-Agent' => 'GitHub-Release-Updater/' . GHRU_VERSION );
	if ( ghru_token( $src ) ) {
		$h['Authorization'] = 'Bearer ' . ghru_token( $src );
	}
	return $h;
}

function ghru_api_error( $code ) {
	if ( 404 === $code ) {
		return __( 'Not found on GitHub. Check the repository, branch and folder (a private repository needs a token).', 'gh-release-updater' );
	}
	if ( 401 === $code || 403 === $code ) {
		return __( 'GitHub refused the request (token wrong, or rate limit reached — add a token).', 'gh-release-updater' );
	}
	return __( 'Could not reach GitHub.', 'gh-release-updater' );
}

function ghru_path_ok( $path ) {
	return '' === $path || ( preg_match( '#^[A-Za-z0-9._ /-]+$#', $path ) && false === strpos( $path, '..' ) && '/' !== $path[0] );
}

function ghru_branch_ok( $b ) {
	return '' === $b || ( preg_match( '#^[A-Za-z0-9._/-]+$#', $b ) && false === strpos( $b, '..' ) );
}

/** Key under which the installed commit of a source is remembered. */
function ghru_src_key( $src ) {
	return md5( $src['item'] . '|' . $src['repo'] . '|' . $src['branch'] . '|' . $src['path'] );
}

function ghru_installed_sha( $src ) {
	$all = get_option( 'ghru_installed', array() );
	$k   = ghru_src_key( $src );
	return is_array( $all ) && isset( $all[ $k ] ) ? (string) $all[ $k ] : '';
}

function ghru_set_installed_sha( $src, $sha ) {
	$all = get_option( 'ghru_installed', array() );
	$all = is_array( $all ) ? $all : array();
	$all[ ghru_src_key( $src ) ] = $sha;
	update_option( 'ghru_installed', $all, false );
}

/**
 * The newest commit on the branch that touched the folder (cached five minutes).
 *
 * @return array sha, short, message, url, package — or error.
 */
function ghru_branch_latest( $src, $force = false ) {
	if ( ! ghru_valid_repo( $src['repo'] ) || ! ghru_branch_ok( $src['branch'] ) || ! ghru_path_ok( $src['path'] ) ) {
		return array( 'error' => __( 'The repository, branch or folder is not valid.', 'gh-release-updater' ) );
	}
	$key = 'ghru_br_' . md5( ghru_fingerprint( $src ) );
	if ( ! $force ) {
		$c = get_site_transient( $key );
		if ( is_array( $c ) ) {
			return $c;
		}
	}
	$check = ! empty( $src['signed'] ) || ghru_trusted( $src );
	$args  = array( 'per_page' => $check ? 30 : 1 );
	if ( '' !== $src['branch'] ) {
		$args['sha'] = $src['branch'];
	}
	if ( '' !== $src['path'] ) {
		$args['path'] = $src['path'];
	}
	$res  = wp_remote_get( add_query_arg( $args, 'https://api.github.com/repos/' . $src['repo'] . '/commits' ), array( 'timeout' => 10, 'headers' => ghru_headers( $src ) ) );
	$code = is_wp_error( $res ) ? 0 : (int) wp_remote_retrieve_response_code( $res );
	$d    = 200 === $code ? json_decode( wp_remote_retrieve_body( $res ), true ) : null;
	if ( 200 !== $code ) {
		$r = array( 'error' => ghru_api_error( $code ) );
		set_site_transient( $key, $r, 5 * MINUTE_IN_SECONDS );
		return $r;
	}
	if ( ! is_array( $d ) || empty( $d[0]['sha'] ) || ! preg_match( '/^[0-9a-f]{40}$/', $d[0]['sha'] ) ) {
		$r = array( 'error' => __( 'No commits found for that branch and folder.', 'gh-release-updater' ) );
		set_site_transient( $key, $r, 5 * MINUTE_IN_SECONDS );
		return $r;
	}
	// Who may change this site: every commit that is new since the last install must come from a trusted account
	// (and be signed, if required). Checking only the newest would let an earlier bad commit ride along.
	$seen = ghru_installed_sha( $src );
	foreach ( $d as $n => $c ) {
		if ( ! $check || ( $seen && isset( $c['sha'] ) && $c['sha'] === $seen ) || ( ! $seen && $n > 0 ) ) {
			break;
		}
		$why = ghru_commit_untrusted( $c, $src );
		if ( $why ) {
			$r = array( 'error' => $why );
			set_site_transient( $key, $r, 5 * MINUTE_IN_SECONDS );
			return $r;
		}
	}
	$sha = $d[0]['sha'];
	$msg = isset( $d[0]['commit']['message'] ) ? (string) $d[0]['commit']['message'] : '';
	$by  = isset( $d[0]['author']['login'] ) ? (string) $d[0]['author']['login'] : '';
	$r   = array(
		'by'      => $by,
		'sha'     => $sha,
		'short'   => substr( $sha, 0, 7 ),
		'message' => $msg,
		'url'     => 'https://github.com/' . $src['repo'] . '/commit/' . $sha,
		// A marker, not a download: upgrader_pre_download recognises it and builds the package itself.
		'package' => 'https://api.github.com/repos/' . $src['repo'] . '/git/trees/' . $sha,
	);
	set_site_transient( $key, $r, 5 * MINUTE_IN_SECONDS );
	return $r;
}

/** Empty when the commit may be installed, otherwise the reason it may not. */
function ghru_commit_untrusted( $c, $src ) {
	$short = isset( $c['sha'] ) ? substr( (string) $c['sha'], 0, 7 ) : '?';
	$trust = ghru_trusted( $src );
	if ( $trust ) {
		$author    = isset( $c['author']['login'] ) ? strtolower( (string) $c['author']['login'] ) : '';
		$committer = isset( $c['committer']['login'] ) ? strtolower( (string) $c['committer']['login'] ) : '';
		// "web-flow" is GitHub itself committing for someone who merged or edited on github.com.
		if ( ! in_array( $author, $trust, true ) || ! ( in_array( $committer, $trust, true ) || 'web-flow' === $committer ) ) {
			return sprintf( /* translators: 1: short commit id 2: GitHub account */ __( 'Commit %1$s is by “%2$s”, who is not on the trusted list, so nothing was installed.', 'gh-release-updater' ), $short, $author ? $author : __( 'an unknown account', 'gh-release-updater' ) );
		}
	}
	if ( ! empty( $src['signed'] ) && empty( $c['commit']['verification']['verified'] ) ) {
		return sprintf( __( 'Commit %s is not signed (verified by GitHub), so nothing was installed.', 'gh-release-updater' ), $short );
	}
	return '';
}

/** Where the item is installed on disk. */
function ghru_installed_dir( $src ) {
	list( $type, $id ) = ghru_item_parts( $src );
	if ( 'plugin' === $type ) {
		return WP_PLUGIN_DIR . '/' . dirname( $id );
	}
	return 'theme' === $type ? get_theme_root( $id ) . '/' . $id : '';
}

/** Git's own checksum of a file, so it can be compared with GitHub's without downloading it. */
function ghru_blob_sha( $file ) {
	$size = filesize( $file );
	$fh   = fopen( $file, 'rb' );
	if ( false === $size || ! $fh ) {
		return '';
	}
	$ctx = hash_init( 'sha1' );
	hash_update( $ctx, 'blob ' . $size . "\0" );
	while ( ! feof( $fh ) ) {
		hash_update( $ctx, (string) fread( $fh, 1048576 ) );
	}
	fclose( $fh );
	return hash_final( $ctx );
}

/** Downloads one repository file to a temp file (public: raw.githubusercontent.com; private: the contents API). */
function ghru_fetch_file( $src, $sha, $path, $to ) {
	if ( ghru_token( $src ) ) {
		$url  = 'https://api.github.com/repos/' . $src['repo'] . '/contents/' . implode( '/', array_map( 'rawurlencode', explode( '/', $path ) ) ) . '?ref=' . $sha;
		$args = array( 'timeout' => 120, 'stream' => true, 'filename' => $to, 'headers' => ghru_headers( $src, 'application/vnd.github.raw+json' ) );
	} else {
		$url  = 'https://raw.githubusercontent.com/' . $src['repo'] . '/' . $sha . '/' . implode( '/', array_map( 'rawurlencode', explode( '/', $path ) ) );
		$args = array( 'timeout' => 120, 'stream' => true, 'filename' => $to, 'headers' => array( 'User-Agent' => 'GitHub-Release-Updater/' . GHRU_VERSION ) );
	}
	$res = wp_remote_get( $url, $args );
	if ( is_wp_error( $res ) ) {
		return $res;
	}
	return 200 === (int) wp_remote_retrieve_response_code( $res ) ? true : new WP_Error( 'ghru_file', sprintf( /* translators: %s: file path */ __( 'Could not download %s from GitHub.', 'gh-release-updater' ), $path ) );
}

function ghru_rrmdir( $dir ) {
	if ( ! is_dir( $dir ) ) {
		return;
	}
	foreach ( scandir( $dir ) as $f ) {
		if ( '.' !== $f && '..' !== $f ) {
			is_dir( "$dir/$f" ) ? ghru_rrmdir( "$dir/$f" ) : @unlink( "$dir/$f" ); // phpcs:ignore WordPress.PHP.NoSilencedErrors, WordPress.WP.AlternativeFunctions
		}
	}
	@rmdir( $dir ); // phpcs:ignore WordPress.PHP.NoSilencedErrors, WordPress.WP.AlternativeFunctions
}

/**
 * Builds the zip WordPress will install: every file of the folder as it is at commit $sha. Files that are
 * unchanged are taken from the installed copy; only different or new files are downloaded.
 *
 * @return string|WP_Error Path of the zip.
 */
function ghru_branch_build_package( $src, $sha ) {
	if ( ! preg_match( '/^[0-9a-f]{40}$/', $sha ) ) {
		return new WP_Error( 'ghru_sha', __( 'Unexpected commit reference.', 'gh-release-updater' ) );
	}
	if ( ! class_exists( 'ZipArchive' ) ) {
		return new WP_Error( 'ghru_zip', __( 'This server has no ZipArchive support, which live-branch updates need.', 'gh-release-updater' ) );
	}
	@set_time_limit( 300 ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
	// Tidy anything an earlier, interrupted update left in the temp folder.
	foreach ( (array) glob( trailingslashit( get_temp_dir() ) . 'ghru-*' ) as $old ) {
		if ( filemtime( $old ) < time() - HOUR_IN_SECONDS ) {
			is_dir( $old ) ? ghru_rrmdir( $old ) : @unlink( $old ); // phpcs:ignore WordPress.PHP.NoSilencedErrors, WordPress.WP.AlternativeFunctions
		}
	}
	$res  = wp_remote_get( 'https://api.github.com/repos/' . $src['repo'] . '/git/trees/' . $sha . '?recursive=1', array( 'timeout' => 30, 'headers' => ghru_headers( $src ) ) );
	$code = is_wp_error( $res ) ? 0 : (int) wp_remote_retrieve_response_code( $res );
	if ( 200 !== $code ) {
		return new WP_Error( 'ghru_tree', ghru_api_error( $code ) );
	}
	$tree = json_decode( wp_remote_retrieve_body( $res ), true );
	if ( ! is_array( $tree ) || empty( $tree['tree'] ) || ! empty( $tree['truncated'] ) ) {
		return new WP_Error( 'ghru_tree', __( 'The repository is too large to read in one go. Point “Folder in repo” at a smaller folder.', 'gh-release-updater' ) );
	}

	$prefix = '' === $src['path'] ? '' : $src['path'] . '/';
	$folder = ghru_folder( $src );
	$local  = ghru_installed_dir( $src );
	$work   = trailingslashit( get_temp_dir() ) . 'ghru-' . wp_generate_password( 10, false );
	$zipf   = $work . '.zip';
	if ( ! wp_mkdir_p( $work ) ) {
		return new WP_Error( 'ghru_tmp', __( 'Could not create a temporary folder.', 'gh-release-updater' ) );
	}
	$zip = new ZipArchive();
	if ( true !== $zip->open( $zipf, ZipArchive::CREATE | ZipArchive::OVERWRITE ) ) {
		ghru_rrmdir( $work );
		return new WP_Error( 'ghru_zip', __( 'Could not create the update package.', 'gh-release-updater' ) );
	}
	$download = 0;
	$files    = 0;
	$limit    = 200 * MB_IN_BYTES;
	foreach ( $tree['tree'] as $e ) {
		if ( empty( $e['type'] ) || 'blob' !== $e['type'] || empty( $e['path'] ) || 0 !== strpos( $e['path'], $prefix ) ) {
			continue;
		}
		if ( isset( $e['mode'] ) && '120000' === $e['mode'] ) {
			continue; // symbolic link.
		}
		$rel = substr( $e['path'], strlen( $prefix ) );
		if ( '' === $rel || false !== strpos( $rel, '..' ) || '/' === $rel[0] || false !== strpos( $rel, "\0" ) ) {
			continue;
		}
		$mine = $local && is_file( $local . '/' . $rel ) ? $local . '/' . $rel : '';
		if ( $mine && ghru_blob_sha( $mine ) === $e['sha'] ) {
			$zip->addFile( $mine, $folder . '/' . $rel );
		} else {
			$download += isset( $e['size'] ) ? (int) $e['size'] : 0;
			if ( $download > $limit ) {
				$zip->close();
				ghru_rrmdir( $work );
				@unlink( $zipf ); // phpcs:ignore WordPress.PHP.NoSilencedErrors, WordPress.WP.AlternativeFunctions
				return new WP_Error( 'ghru_big', __( 'Too much changed to download in one update (over 200 MB).', 'gh-release-updater' ) );
			}
			$tmp = $work . '/f' . $files;
			$ok  = ghru_fetch_file( $src, $sha, $e['path'], $tmp );
			if ( is_wp_error( $ok ) ) {
				$zip->close();
				ghru_rrmdir( $work );
				@unlink( $zipf ); // phpcs:ignore WordPress.PHP.NoSilencedErrors, WordPress.WP.AlternativeFunctions
				return $ok;
			}
			$zip->addFile( $tmp, $folder . '/' . $rel );
		}
		++$files;
	}
	if ( ! $files ) {
		$zip->close();
		ghru_rrmdir( $work );
		@unlink( $zipf ); // phpcs:ignore WordPress.PHP.NoSilencedErrors, WordPress.WP.AlternativeFunctions
		return new WP_Error( 'ghru_empty', __( 'No files found in that folder of the repository.', 'gh-release-updater' ) );
	}
	$zip->close(); // the temp files must stay until here.
	ghru_rrmdir( $work );
	set_site_transient( 'ghru_pending_' . ghru_src_key( $src ), $sha, HOUR_IN_SECONDS );
	return $zipf;
}

/** Remember which commit was installed, so the update is not offered again. */
add_action( 'upgrader_process_complete', function ( $upgrader, $extra ) {
	if ( ! is_array( $extra ) || empty( $extra['action'] ) || 'update' !== $extra['action'] || empty( $extra['type'] ) ) {
		return;
	}
	$done = array();
	if ( 'plugin' === $extra['type'] ) {
		$done = isset( $extra['plugins'] ) ? (array) $extra['plugins'] : ( isset( $extra['plugin'] ) ? array( $extra['plugin'] ) : array() );
	} elseif ( 'theme' === $extra['type'] ) {
		$done = isset( $extra['themes'] ) ? (array) $extra['themes'] : ( isset( $extra['theme'] ) ? array( $extra['theme'] ) : array() );
	}
	foreach ( ghru_sources() as $src ) {
		list( $type, $id ) = ghru_item_parts( $src );
		if ( 'branch' !== $src['mode'] || $type !== $extra['type'] || ! in_array( $id, $done, true ) ) {
			continue;
		}
		$sha = get_site_transient( 'ghru_pending_' . ghru_src_key( $src ) );
		if ( $sha ) {
			ghru_set_installed_sha( $src, $sha );
			delete_site_transient( 'ghru_pending_' . ghru_src_key( $src ) );
			delete_site_transient( 'update_plugins' );
			delete_site_transient( 'update_themes' );
		}
	}
}, 10, 2 );

/* ───────── Look for new commits every 15 minutes, and install where automatic updates are switched on ───────── */
add_filter( 'cron_schedules', function ( $s ) {
	$s['ghru_15min'] = array( 'interval' => 15 * MINUTE_IN_SECONDS, 'display' => __( 'Every 15 minutes', 'gh-release-updater' ) );
	return $s;
} );

add_action( 'init', function () {
	$has  = false;
	foreach ( ghru_sources() as $src ) {
		$has = $has || 'branch' === $src['mode'];
	}
	$next = wp_next_scheduled( 'ghru_cron' );
	if ( $has && ! $next ) {
		wp_schedule_event( time() + 60, 'ghru_15min', 'ghru_cron' );
	} elseif ( ! $has && $next ) {
		wp_unschedule_event( $next, 'ghru_cron' );
	}
} );

add_action( 'ghru_cron', function () {
	$found = false;
	foreach ( ghru_sources() as $src ) {
		if ( 'branch' !== $src['mode'] ) {
			continue;
		}
		$st    = ghru_state( $src );
		$found = $found || ! empty( $st['available'] );
	}
	if ( ! $found ) {
		return;
	}
	delete_site_transient( 'update_plugins' );
	delete_site_transient( 'update_themes' );
	wp_update_plugins();
	wp_update_themes();
	// WordPress's own automatic updater installs whatever has "auto-updates enabled" (with rollback for plugins).
	if ( function_exists( 'wp_maybe_auto_update' ) ) {
		wp_maybe_auto_update();
	}
} );
