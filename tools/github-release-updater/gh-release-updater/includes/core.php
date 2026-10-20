<?php
/**
 * Release lookup and WordPress update integration.
 *
 * Each "source" ties one installed plugin or theme to one GitHub repository:
 *   item  "plugin|folder/file.php"  or  "theme|folder"
 *   repo  "owner/name"
 *   asset the zip attached to the release (default: <folder>.zip)
 *   token optional GitHub token, needed only for private repositories
 *
 * @package GH_Release_Updater
 */

defined( 'ABSPATH' ) || exit;

/** @return array[] Saved sources. */
function ghru_sources() {
	$s = get_option( 'ghru_sources', array() );
	return is_array( $s ) ? array_values( array_filter( $s, 'is_array' ) ) : array();
}

function ghru_item_parts( $src ) {
	$p = explode( '|', isset( $src['item'] ) ? (string) $src['item'] : '', 2 );
	return array( 'plugin' === $p[0] || 'theme' === $p[0] ? $p[0] : '', isset( $p[1] ) ? $p[1] : '' );
}

function ghru_valid_repo( $repo ) {
	return (bool) preg_match( '#^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$#', (string) $repo );
}

/** The folder name the item must be installed into. */
function ghru_folder( $src ) {
	list( $type, $id ) = ghru_item_parts( $src );
	return 'plugin' === $type ? dirname( $id ) : $id;
}

/** Token for a source: wp-config constant first (GHRU_TOKEN, or GHRU_TOKENS['owner/name']), else the saved one. */
function ghru_token( $src ) {
	if ( defined( 'GHRU_TOKENS' ) && is_array( GHRU_TOKENS ) && ! empty( GHRU_TOKENS[ $src['repo'] ] ) ) {
		return (string) GHRU_TOKENS[ $src['repo'] ];
	}
	if ( defined( 'GHRU_TOKEN' ) && GHRU_TOKEN ) {
		return (string) GHRU_TOKEN;
	}
	return isset( $src['token'] ) ? (string) $src['token'] : '';
}

function ghru_installed_version( $src ) {
	list( $type, $id ) = ghru_item_parts( $src );
	if ( 'plugin' === $type ) {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		$all = get_plugins();
		return isset( $all[ $id ] ) ? (string) $all[ $id ]['Version'] : '';
	}
	if ( 'theme' === $type ) {
		$t = wp_get_theme( $id );
		return $t->exists() ? (string) $t->get( 'Version' ) : '';
	}
	return '';
}

/**
 * Latest release of a source's repository (cached six hours; failures fifteen minutes).
 *
 * @return array Either array( 'error' => message ) or the release with its zip package URL.
 */
function ghru_release( $src, $force = false ) {
	if ( ! ghru_valid_repo( $src['repo'] ) ) {
		return array( 'error' => __( 'The repository must look like owner/name.', 'gh-release-updater' ) );
	}
	$key   = 'ghru_' . md5( $src['repo'] . '|' . ghru_token( $src ) );
	$asset = ! empty( $src['asset'] ) ? $src['asset'] : ghru_folder( $src ) . '.zip';
	if ( ! $force ) {
		$c = get_site_transient( $key );
		if ( is_array( $c ) ) {
			return ghru_pick_asset( $c, $asset );
		}
	}
	$headers = array( 'Accept' => 'application/vnd.github+json', 'User-Agent' => 'GitHub-Release-Updater/' . GHRU_VERSION );
	if ( ghru_token( $src ) ) {
		$headers['Authorization'] = 'Bearer ' . ghru_token( $src );
	}
	$res  = wp_remote_get( 'https://api.github.com/repos/' . $src['repo'] . '/releases/latest', array( 'timeout' => 10, 'headers' => $headers ) );
	$code = is_wp_error( $res ) ? 0 : (int) wp_remote_retrieve_response_code( $res );
	if ( 200 !== $code ) {
		if ( 404 === $code ) {
			$msg = __( 'No published release found. If the repository is private, add a token.', 'gh-release-updater' );
		} elseif ( 401 === $code || 403 === $code ) {
			$msg = __( 'GitHub refused the request (token wrong, or rate limit reached).', 'gh-release-updater' );
		} else {
			$msg = __( 'Could not reach GitHub.', 'gh-release-updater' );
		}
		$r = array( 'error' => $msg );
		set_site_transient( $key, $r, 15 * MINUTE_IN_SECONDS );
		return $r;
	}
	$d   = json_decode( wp_remote_retrieve_body( $res ), true );
	$ver = is_array( $d ) && ! empty( $d['tag_name'] ) ? ltrim( (string) $d['tag_name'], 'vV' ) : '';
	if ( ! $ver || ! preg_match( '/^\d+(\.\d+){1,3}([-+][0-9A-Za-z.-]+)?$/', $ver ) || ! empty( $d['draft'] ) || ! empty( $d['prerelease'] ) ) {
		$r = array( 'error' => __( 'The latest release has no version-style tag (like v1.2.3).', 'gh-release-updater' ) );
		set_site_transient( $key, $r, 15 * MINUTE_IN_SECONDS );
		return $r;
	}
	$assets = array();
	foreach ( isset( $d['assets'] ) && is_array( $d['assets'] ) ? $d['assets'] : array() as $a ) {
		if ( empty( $a['name'] ) ) {
			continue;
		}
		$assets[ $a['name'] ] = array(
			'browser' => isset( $a['browser_download_url'] ) ? (string) $a['browser_download_url'] : '',
			'api'     => ! empty( $a['id'] ) ? 'https://api.github.com/repos/' . $src['repo'] . '/releases/assets/' . (int) $a['id'] : '',
		);
	}
	$rel = array(
		'version'   => $ver,
		'url'       => isset( $d['html_url'] ) ? esc_url_raw( $d['html_url'] ) : 'https://github.com/' . $src['repo'] . '/releases',
		'notes'     => isset( $d['body'] ) ? (string) $d['body'] : '',
		'published' => isset( $d['published_at'] ) ? (string) $d['published_at'] : '',
		'assets'    => $assets,
	);
	set_site_transient( $key, $rel, 6 * HOUR_IN_SECONDS );
	return ghru_pick_asset( $rel, $asset );
}

/** Adds 'package' (the zip URL to install) and 'asset' (its name) to a cached release. */
function ghru_pick_asset( $rel, $asset ) {
	if ( isset( $rel['error'] ) ) {
		return $rel;
	}
	if ( ! isset( $rel['assets'][ $asset ] ) ) {
		$rel['error'] = sprintf( /* translators: %s: zip file name */ __( 'The latest release has no “%s” file attached.', 'gh-release-updater' ), $asset );
		return $rel;
	}
	$rel['asset']   = $asset;
	$rel['package'] = $rel['assets'][ $asset ];
	return $rel;
}

/** The package URL WordPress should download: the API URL when a token is set (private repos), else the public one. */
function ghru_package_url( $src, $rel ) {
	$p = $rel['package'];
	return ghru_token( $src ) && $p['api'] ? $p['api'] : $p['browser'];
}

/** Which source (if any) owns a package URL. Only URLs inside the source's own repository are accepted. */
function ghru_source_for_package( $url ) {
	foreach ( ghru_sources() as $src ) {
		if ( ! ghru_valid_repo( $src['repo'] ) ) {
			continue;
		}
		if ( 0 === strpos( $url, 'https://github.com/' . $src['repo'] . '/releases/download/' ) || 0 === strpos( $url, 'https://api.github.com/repos/' . $src['repo'] . '/releases/assets/' ) ) {
			return $src;
		}
	}
	return null;
}

/* ───────── Plugins ───────── */
add_filter( 'pre_set_site_transient_update_plugins', function ( $t ) {
	if ( ! is_object( $t ) ) {
		return $t;
	}
	foreach ( ghru_sources() as $src ) {
		list( $type, $file ) = ghru_item_parts( $src );
		$have                = 'plugin' === $type ? ghru_installed_version( $src ) : '';
		$rel                 = $have ? ghru_release( $src ) : array( 'error' => 'x' );
		if ( isset( $rel['error'] ) ) {
			continue;
		}
		$item = (object) array(
			'id'          => 'github.com/' . $src['repo'],
			'slug'        => dirname( $file ),
			'plugin'      => $file,
			'new_version' => $rel['version'],
			'url'         => $rel['url'],
			'package'     => ghru_package_url( $src, $rel ),
			'icons'       => array(),
			'banners'     => array(),
		);
		if ( version_compare( $rel['version'], $have, '>' ) ) {
			$t->response[ $file ] = $item;
			unset( $t->no_update[ $file ] );
		} else {
			$item->package         = '';
			$t->no_update[ $file ] = $item;
			unset( $t->response[ $file ] );
		}
	}
	return $t;
} );

add_filter( 'plugins_api', function ( $res, $action, $args ) {
	if ( 'plugin_information' !== $action || empty( $args->slug ) ) {
		return $res;
	}
	foreach ( ghru_sources() as $src ) {
		list( $type, $file ) = ghru_item_parts( $src );
		if ( 'plugin' !== $type || dirname( $file ) !== $args->slug ) {
			continue;
		}
		$rel = ghru_release( $src );
		if ( isset( $rel['error'] ) ) {
			return $res;
		}
		$all  = function_exists( 'get_plugins' ) ? get_plugins() : array();
		$name = isset( $all[ $file ] ) ? $all[ $file ]['Name'] : $args->slug;
		return (object) array(
			'name'          => $name,
			'slug'          => $args->slug,
			'version'       => $rel['version'],
			'homepage'      => $rel['url'],
			'download_link' => ghru_package_url( $src, $rel ),
			'sections'      => array( 'changelog' => wp_kses_post( wpautop( esc_html( $rel['notes'] ? $rel['notes'] : __( 'See the release page on GitHub.', 'gh-release-updater' ) ) ) ) ),
		);
	}
	return $res;
}, 10, 3 );

/* ───────── Themes ───────── */
add_filter( 'pre_set_site_transient_update_themes', function ( $t ) {
	if ( ! is_object( $t ) ) {
		return $t;
	}
	foreach ( ghru_sources() as $src ) {
		list( $type, $slug ) = ghru_item_parts( $src );
		$have                = 'theme' === $type ? ghru_installed_version( $src ) : '';
		$rel                 = $have ? ghru_release( $src ) : array( 'error' => 'x' );
		if ( isset( $rel['error'] ) ) {
			continue;
		}
		$item = array(
			'theme'        => $slug,
			'new_version'  => $rel['version'],
			'url'          => $rel['url'],
			'package'      => ghru_package_url( $src, $rel ),
			'requires'     => '',
			'requires_php' => '',
		);
		if ( version_compare( $rel['version'], $have, '>' ) ) {
			$t->response[ $slug ] = $item;
			unset( $t->no_update[ $slug ] );
		} else {
			$item['package']       = '';
			$t->no_update[ $slug ] = $item;
			unset( $t->response[ $slug ] );
		}
	}
	return $t;
} );

/* ───────── Download (private repositories) ───────── */

/**
 * GitHub answers an authenticated asset request with a redirect to a signed address that must NOT receive
 * the token. So ask GitHub for the redirect without following it, then download from the signed address.
 */
add_filter( 'upgrader_pre_download', function ( $reply, $package ) {
	$src = is_string( $package ) && 0 === strpos( $package, 'https://api.github.com/repos/' ) ? ghru_source_for_package( $package ) : null;
	if ( ! $src || ! ghru_token( $src ) ) {
		return $reply;
	}
	$res = wp_remote_get(
		$package,
		array(
			'timeout'     => 30,
			'redirection' => 0,
			'headers'     => array(
				'Authorization' => 'Bearer ' . ghru_token( $src ),
				'Accept'        => 'application/octet-stream',
				'User-Agent'    => 'GitHub-Release-Updater/' . GHRU_VERSION,
			),
		)
	);
	if ( is_wp_error( $res ) ) {
		return $res;
	}
	$loc = wp_remote_retrieve_header( $res, 'location' );
	if ( (int) wp_remote_retrieve_response_code( $res ) >= 300 && (int) wp_remote_retrieve_response_code( $res ) < 400 && is_string( $loc ) && 0 === strpos( $loc, 'https://' ) ) {
		return download_url( $loc, 300 );
	}
	return new WP_Error( 'ghru_download', __( 'GitHub did not provide the download. Check the token can read this repository.', 'gh-release-updater' ) );
}, 10, 2 );

/* ───────── Install into the folder already in use ───────── */
add_filter( 'upgrader_source_selection', function ( $source, $remote_source, $upgrader, $extra ) {
	if ( is_wp_error( $source ) || ! is_array( $extra ) ) {
		return $source;
	}
	foreach ( ghru_sources() as $src ) {
		list( $type, $id ) = ghru_item_parts( $src );
		$mine              = ( 'plugin' === $type && ! empty( $extra['plugin'] ) && $extra['plugin'] === $id ) || ( 'theme' === $type && ! empty( $extra['theme'] ) && $extra['theme'] === $id );
		if ( ! $mine ) {
			continue;
		}
		$want = ghru_folder( $src );
		if ( basename( untrailingslashit( $source ) ) === $want ) {
			return $source;
		}
		global $wp_filesystem;
		$new = trailingslashit( $remote_source ) . $want;
		return $wp_filesystem && $wp_filesystem->move( untrailingslashit( $source ), $new, true ) ? trailingslashit( $new ) : $source;
	}
	return $source;
}, 10, 4 );
