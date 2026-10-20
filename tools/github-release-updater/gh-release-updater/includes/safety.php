<?php
/**
 * Version safety: a copy of what is installed is kept before every update, so you can always go back.
 *
 * The last three copies of each item are kept in a folder inside wp-content with a hard-to-guess name that
 * the web server is told not to serve. "Restore" installs a copy through WordPress's normal updater and puts
 * automatic updates on hold until a newer version or commit arrives, so a rollback is not undone by itself.
 *
 * @package GH_Release_Updater
 */

defined( 'ABSPATH' ) || exit;

const GHRU_KEEP = 3;

function ghru_backup_root() {
	$dir = WP_CONTENT_DIR . '/ghru-backups-' . substr( wp_hash( 'ghru-backups' ), 0, 12 );
	if ( ! is_dir( $dir ) && wp_mkdir_p( $dir ) ) {
		file_put_contents( $dir . '/index.php', "<?php\n// Silence is golden.\n" ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		file_put_contents( $dir . '/.htaccess', "Require all denied\nDeny from all\n" ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	}
	return $dir;
}

function ghru_backup_dir( $src ) {
	return ghru_backup_root() . '/' . substr( ghru_src_key( $src ), 0, 16 );
}

/** Saved copies of an item, newest first. Each is array( file, time, version, sha ). */
function ghru_backups( $src ) {
	$out = array();
	foreach ( (array) glob( ghru_backup_dir( $src ) . '/*.json' ) as $j ) {
		$m = json_decode( (string) file_get_contents( $j ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		if ( is_array( $m ) && ! empty( $m['file'] ) && is_file( dirname( $j ) . '/' . $m['file'] ) ) {
			$out[] = $m;
		}
	}
	usort( $out, function ( $a, $b ) {
		return $b['time'] <=> $a['time'];
	} );
	return $out;
}

/** Zips the installed folder before WordPress replaces it. */
function ghru_make_backup( $src ) {
	$local = ghru_installed_dir( $src );
	if ( ! $local || ! is_dir( $local ) || ! class_exists( 'ZipArchive' ) ) {
		return false;
	}
	$dir = ghru_backup_dir( $src );
	if ( ! wp_mkdir_p( $dir ) ) {
		return false;
	}
	$id   = gmdate( 'Ymd-His' ) . '-' . substr( md5( uniqid( '', true ) ), 0, 8 );
	$file = $id . '.zip';
	$zip  = new ZipArchive();
	if ( true !== $zip->open( $dir . '/' . $file, ZipArchive::CREATE | ZipArchive::OVERWRITE ) ) {
		return false;
	}
	$folder = ghru_folder( $src );
	$base   = rtrim( $local, '/' ) . '/';
	$it     = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $local, FilesystemIterator::SKIP_DOTS ) );
	foreach ( $it as $f ) {
		if ( $f->isFile() && ! $f->isLink() ) {
			$zip->addFile( $f->getPathname(), $folder . '/' . substr( $f->getPathname(), strlen( $base ) ) );
		}
	}
	$zip->close();
	$meta = array(
		'file'    => $file,
		'time'    => time(),
		'version' => ghru_installed_version( $src ),
		'sha'     => ghru_installed_sha( $src ),
	);
	file_put_contents( $dir . '/' . $id . '.json', wp_json_encode( $meta ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	foreach ( array_slice( ghru_backups( $src ), GHRU_KEEP ) as $old ) {
		@unlink( $dir . '/' . $old['file'] ); // phpcs:ignore WordPress.PHP.NoSilencedErrors, WordPress.WP.AlternativeFunctions
		@unlink( $dir . '/' . basename( $old['file'], '.zip' ) . '.json' ); // phpcs:ignore WordPress.PHP.NoSilencedErrors, WordPress.WP.AlternativeFunctions
	}
	return $meta;
}

/** Before any update of a connected item: keep a copy of what is there now. */
add_filter( 'upgrader_pre_install', function ( $response, $extra ) {
	if ( is_wp_error( $response ) || ! is_array( $extra ) ) {
		return $response;
	}
	foreach ( ghru_sources() as $src ) {
		list( $type, $id ) = ghru_item_parts( $src );
		if ( ( 'plugin' === $type && isset( $extra['plugin'] ) && $extra['plugin'] === $id ) || ( 'theme' === $type && isset( $extra['theme'] ) && $extra['theme'] === $id ) ) {
			if ( ghru_is_verified( $src ) ) {
				ghru_make_backup( $src );
			}
		}
	}
	return $response;
}, 5, 2 );

/* ───────── Rollback ───────── */

/** Starts a restore: remember which copy to install, then hand over to WordPress's own update screen. */
add_action( 'admin_post_ghru_restore', function () {
	$key  = isset( $_GET['k'] ) ? sanitize_key( wp_unslash( $_GET['k'] ) ) : '';
	$file = isset( $_GET['f'] ) ? sanitize_file_name( wp_unslash( $_GET['f'] ) ) : '';
	check_admin_referer( 'ghru_restore_' . $key . $file );
	if ( ! current_user_can( 'update_plugins' ) ) {
		wp_die( esc_html__( 'You are not allowed to do that.', 'gh-release-updater' ) );
	}
	foreach ( ghru_sources() as $src ) {
		if ( substr( ghru_src_key( $src ), 0, 16 ) !== $key || ! ghru_is_verified( $src ) ) {
			continue;
		}
		foreach ( ghru_backups( $src ) as $b ) {
			if ( $b['file'] === $file ) {
				// Hold today's newest so the automatic updater does not put it straight back.
				$now  = ghru_state_raw( $src, true, ghru_installed_version( $src ) );
				$hold = get_option( 'ghru_hold', array() );
				$hold = is_array( $hold ) ? $hold : array();
				if ( empty( $now['error'] ) ) {
					$hold[ ghru_src_key( $src ) ] = $now['new_version'];
					update_option( 'ghru_hold', $hold, false );
				}
				update_option( 'ghru_rollback', array( ghru_src_key( $src ) => array( 'file' => $file, 'exp' => time() + 600 ) ), false );
				delete_site_transient( 'update_plugins' );
				delete_site_transient( 'update_themes' );
				wp_safe_redirect( ghru_update_link( $src ) );
				exit;
			}
		}
	}
	wp_die( esc_html__( 'That saved copy was not found.', 'gh-release-updater' ) );
} );

add_action( 'admin_post_ghru_unhold', function () {
	check_admin_referer( 'ghru_unhold' );
	if ( ! current_user_can( 'update_plugins' ) ) {
		wp_die( esc_html__( 'You are not allowed to do that.', 'gh-release-updater' ) );
	}
	delete_option( 'ghru_hold' );
	delete_site_transient( 'update_plugins' );
	delete_site_transient( 'update_themes' );
	wp_safe_redirect( admin_url( 'options-general.php?page=ghru' ) );
	exit;
} );

/** Pending restore for a source, or null. */
function ghru_pending_restore( $src ) {
	$r = get_option( 'ghru_rollback', array() );
	$k = ghru_src_key( $src );
	return is_array( $r ) && isset( $r[ $k ] ) && $r[ $k ]['exp'] > time() ? $r[ $k ] : null;
}

/** While a restore is pending, WordPress is told the saved copy is the "update" to install. */
function ghru_inject_restore( $t, $kind ) {
	if ( ! is_object( $t ) ) {
		return $t;
	}
	foreach ( ghru_sources() as $src ) {
		list( $type, $id ) = ghru_item_parts( $src );
		$p                 = $type === $kind ? ghru_pending_restore( $src ) : null;
		if ( ! $p || ! ghru_is_verified( $src ) ) {
			continue;
		}
		$pkg = 'https://api.github.com/repos/' . $src['repo'] . '/git/trees/restore-' . $p['file'];
		if ( 'plugin' === $kind ) {
			$t->response[ $id ] = (object) array( 'id' => 'github.com/' . $src['repo'], 'slug' => dirname( $id ), 'plugin' => $id, 'new_version' => 'restore', 'url' => '', 'package' => $pkg );
		} else {
			$t->response[ $id ] = array( 'theme' => $id, 'new_version' => 'restore', 'url' => '', 'package' => $pkg, 'requires' => '', 'requires_php' => '' );
		}
	}
	return $t;
}
add_filter( 'site_transient_update_plugins', function ( $t ) {
	return ghru_inject_restore( $t, 'plugin' );
} );
add_filter( 'site_transient_update_themes', function ( $t ) {
	return ghru_inject_restore( $t, 'theme' );
} );

/** Hands WordPress a temporary copy of the saved zip (WordPress deletes whatever it is given after installing). */
function ghru_restore_package( $src, $file ) {
	$p = ghru_pending_restore( $src );
	if ( ! $p || $p['file'] !== $file || ! ghru_is_verified( $src ) ) {
		return new WP_Error( 'ghru_restore', __( 'No restore is pending for this item.', 'gh-release-updater' ) );
	}
	$path = ghru_backup_dir( $src ) . '/' . basename( $file );
	if ( ! preg_match( '/^[0-9]{8}-[0-9]{6}-[0-9a-f]{8}\.zip$/', basename( $file ) ) || ! is_file( $path ) ) {
		return new WP_Error( 'ghru_restore', __( 'That saved copy is missing.', 'gh-release-updater' ) );
	}
	$tmp = wp_tempnam( 'ghru-restore.zip' );
	return copy( $path, $tmp ) ? $tmp : new WP_Error( 'ghru_restore', __( 'Could not read the saved copy.', 'gh-release-updater' ) );
}

/** After a restore: forget it, and remember the commit that is now installed. */
add_action( 'upgrader_process_complete', function ( $upgrader, $extra ) {
	if ( ! is_array( $extra ) || empty( $extra['type'] ) ) {
		return;
	}
	foreach ( ghru_sources() as $src ) {
		list( $type, $id ) = ghru_item_parts( $src );
		$mine              = ( 'plugin' === $type && 'plugin' === $extra['type'] && ( ( isset( $extra['plugin'] ) && $extra['plugin'] === $id ) || ( isset( $extra['plugins'] ) && in_array( $id, (array) $extra['plugins'], true ) ) ) )
			|| ( 'theme' === $type && 'theme' === $extra['type'] && ( ( isset( $extra['theme'] ) && $extra['theme'] === $id ) || ( isset( $extra['themes'] ) && in_array( $id, (array) $extra['themes'], true ) ) ) );
		$p                 = $mine ? ghru_pending_restore( $src ) : null;
		if ( ! $p ) {
			continue;
		}
		foreach ( ghru_backups( $src ) as $b ) {
			if ( $b['file'] === $p['file'] && 'branch' === $src['mode'] && $b['sha'] ) {
				ghru_set_installed_sha( $src, $b['sha'] );
			}
		}
		delete_option( 'ghru_rollback' );
		delete_site_transient( 'ghru_pending_' . ghru_src_key( $src ) );
		delete_site_transient( 'update_plugins' );
		delete_site_transient( 'update_themes' );
	}
}, 9, 2 );
