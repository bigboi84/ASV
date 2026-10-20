<?php
/**
 * One-click updates from GitHub releases, for this plugin and the AFSV VRC theme.
 *
 * A release tagged vX.Y.Z on github.com/bigboi84/ASV carries two zips (built by
 * .github/workflows/release.yml): afsv-vrc-core.zip and afsv-vrc.zip. WordPress then offers
 * them like any other update (Dashboard → Updates, or Plugins / Appearance → Themes).
 * Nothing is installed without someone clicking Update (or switching on WordPress's own
 * auto-updates for these two items).
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

const AFSV_UPDATE_REPO       = 'bigboi84/ASV';
const AFSV_UPDATE_PLUGIN_ZIP = 'afsv-vrc-core.zip';
const AFSV_UPDATE_THEME_ZIP  = 'afsv-vrc.zip';
const AFSV_UPDATE_THEME_NAME = 'AFSV VRC';

/** The latest published GitHub release, cached for six hours; null when GitHub cannot be reached. */
function afsv_updater_release( $force = false ) {
	if ( ! $force ) {
		$c = get_site_transient( 'afsv_gh_release' );
		if ( is_array( $c ) ) {
			return $c;
		}
		if ( 'fail' === $c ) {
			return null;
		}
	}
	$res = wp_remote_get(
		'https://api.github.com/repos/' . AFSV_UPDATE_REPO . '/releases/latest',
		array(
			'timeout' => 10,
			'headers' => array(
				'Accept'     => 'application/vnd.github+json',
				'User-Agent' => 'AFSV-VRC-Core/' . AFSV_CORE_VERSION,
			),
		)
	);
	$d   = is_wp_error( $res ) || 200 !== (int) wp_remote_retrieve_response_code( $res ) ? null : json_decode( wp_remote_retrieve_body( $res ), true );
	$ver = is_array( $d ) && ! empty( $d['tag_name'] ) ? ltrim( (string) $d['tag_name'], 'vV' ) : '';
	if ( ! $ver || ! preg_match( '/^\d+(\.\d+){1,3}$/', $ver ) || ! empty( $d['draft'] ) || ! empty( $d['prerelease'] ) ) {
		set_site_transient( 'afsv_gh_release', 'fail', 15 * MINUTE_IN_SECONDS );
		return null;
	}
	// Only accept packages hosted on this repository's own release downloads.
	$prefix = 'https://github.com/' . AFSV_UPDATE_REPO . '/releases/download/';
	$zips   = array();
	foreach ( isset( $d['assets'] ) && is_array( $d['assets'] ) ? $d['assets'] : array() as $a ) {
		$u = isset( $a['browser_download_url'] ) ? (string) $a['browser_download_url'] : '';
		if ( 0 === strpos( $u, $prefix ) && ! empty( $a['name'] ) ) {
			$zips[ $a['name'] ] = $u;
		}
	}
	$rel = array(
		'version'    => $ver,
		'url'        => isset( $d['html_url'] ) ? esc_url_raw( $d['html_url'] ) : 'https://github.com/' . AFSV_UPDATE_REPO . '/releases',
		'notes'      => isset( $d['body'] ) ? (string) $d['body'] : '',
		'published'  => isset( $d['published_at'] ) ? (string) $d['published_at'] : '',
		'plugin_zip' => isset( $zips[ AFSV_UPDATE_PLUGIN_ZIP ] ) ? $zips[ AFSV_UPDATE_PLUGIN_ZIP ] : '',
		'theme_zip'  => isset( $zips[ AFSV_UPDATE_THEME_ZIP ] ) ? $zips[ AFSV_UPDATE_THEME_ZIP ] : '',
	);
	set_site_transient( 'afsv_gh_release', $rel, 6 * HOUR_IN_SECONDS );
	return $rel;
}

/** Folder name of the installed AFSV VRC theme (it may be afsv-vrc or afsv-vrc-theme). */
function afsv_updater_theme_slug() {
	$t = wp_get_theme();
	if ( AFSV_UPDATE_THEME_NAME === $t->get( 'Name' ) ) {
		return $t->get_stylesheet();
	}
	foreach ( array( 'afsv-vrc', 'afsv-vrc-theme' ) as $s ) {
		if ( wp_get_theme( $s )->exists() ) {
			return $s;
		}
	}
	return '';
}

function afsv_updater_plugin_file() {
	return plugin_basename( AFSV_CORE_DIR . 'afsv-vrc-core.php' );
}

/* ───────── Tell WordPress about the plugin and theme updates ───────── */

add_filter( 'pre_set_site_transient_update_plugins', function ( $t ) {
	$rel = is_object( $t ) ? afsv_updater_release() : null;
	if ( ! $rel || ! $rel['plugin_zip'] ) {
		return $t;
	}
	$file = afsv_updater_plugin_file();
	$item = (object) array(
		'id'          => 'github.com/' . AFSV_UPDATE_REPO,
		'slug'        => dirname( $file ),
		'plugin'      => $file,
		'new_version' => $rel['version'],
		'url'         => $rel['url'],
		'package'     => $rel['plugin_zip'],
		'icons'       => array(),
		'banners'     => array(),
	);
	if ( version_compare( $rel['version'], AFSV_CORE_VERSION, '>' ) ) {
		$t->response[ $file ] = $item;
		unset( $t->no_update[ $file ] );
	} else {
		$item->package           = '';
		$t->no_update[ $file ]   = $item;
		unset( $t->response[ $file ] );
	}
	return $t;
} );

add_filter( 'pre_set_site_transient_update_themes', function ( $t ) {
	$slug = afsv_updater_theme_slug();
	$rel  = is_object( $t ) && $slug ? afsv_updater_release() : null;
	if ( ! $rel || ! $rel['theme_zip'] ) {
		return $t;
	}
	$item = array(
		'theme'        => $slug,
		'new_version'  => $rel['version'],
		'url'          => $rel['url'],
		'package'      => $rel['theme_zip'],
		'requires'     => '6.5',
		'requires_php' => '7.4',
	);
	if ( version_compare( $rel['version'], wp_get_theme( $slug )->get( 'Version' ), '>' ) ) {
		$t->response[ $slug ] = $item;
		unset( $t->no_update[ $slug ] );
	} else {
		$item['package']       = '';
		$t->no_update[ $slug ] = $item;
		unset( $t->response[ $slug ] );
	}
	return $t;
} );

/** "View details" popup for the plugin. */
add_filter( 'plugins_api', function ( $res, $action, $args ) {
	if ( 'plugin_information' !== $action || empty( $args->slug ) || dirname( afsv_updater_plugin_file() ) !== $args->slug ) {
		return $res;
	}
	$rel = afsv_updater_release();
	if ( ! $rel ) {
		return $res;
	}
	return (object) array(
		'name'          => 'AFSV VRC Core',
		'slug'          => $args->slug,
		'version'       => $rel['version'],
		'author'        => 'AFSV VRC Global Development Group Limited',
		'homepage'      => $rel['url'],
		'download_link' => $rel['plugin_zip'],
		'sections'      => array(
			'description' => esc_html__( 'Widgets, forms, events, leadership and the page importer for the AFSV VRC website.', 'afsv-vrc-core' ),
			'changelog'   => wp_kses_post( wpautop( esc_html( $rel['notes'] ? $rel['notes'] : __( 'See the release page on GitHub.', 'afsv-vrc-core' ) ) ) ),
		),
	);
}, 10, 3 );

/**
 * Whatever the zip's top folder is called, install into the folder that is already in use,
 * so an update can never create a second copy of the plugin or theme.
 */
add_filter( 'upgrader_source_selection', function ( $source, $remote_source, $upgrader, $extra ) {
	if ( is_wp_error( $source ) ) {
		return $source;
	}
	$want = '';
	if ( ! empty( $extra['plugin'] ) && afsv_updater_plugin_file() === $extra['plugin'] && file_exists( trailingslashit( $source ) . 'afsv-vrc-core.php' ) ) {
		$want = dirname( afsv_updater_plugin_file() );
	} elseif ( ! empty( $extra['theme'] ) && afsv_updater_theme_slug() === $extra['theme'] && file_exists( trailingslashit( $source ) . 'style.css' ) ) {
		$want = $extra['theme'];
	}
	if ( ! $want || basename( untrailingslashit( $source ) ) === $want ) {
		return $source;
	}
	global $wp_filesystem;
	$new = trailingslashit( $remote_source ) . $want;
	return $wp_filesystem && $wp_filesystem->move( untrailingslashit( $source ), $new, true ) ? trailingslashit( $new ) : $source;
}, 10, 4 );

/* ───────── Settings → AFSV VRC updates ───────── */

add_action( 'admin_menu', function () {
	add_options_page( __( 'AFSV VRC updates', 'afsv-vrc-core' ), __( 'AFSV VRC updates', 'afsv-vrc-core' ), 'update_plugins', 'afsv-updates', 'afsv_updater_screen' );
} );

function afsv_updater_screen() {
	if ( ! current_user_can( 'update_plugins' ) ) {
		return;
	}
	$checked = false;
	if ( isset( $_POST['afsv_updates_nonce'] ) && wp_verify_nonce( sanitize_key( $_POST['afsv_updates_nonce'] ), 'afsv_updates_check' ) ) {
		delete_site_transient( 'afsv_gh_release' );
		afsv_updater_release( true );
		delete_site_transient( 'update_plugins' );
		delete_site_transient( 'update_themes' );
		wp_update_plugins();
		wp_update_themes();
		$checked = true;
	}
	$rel   = afsv_updater_release();
	$slug  = afsv_updater_theme_slug();
	$theme = $slug ? wp_get_theme( $slug )->get( 'Version' ) : '';
	$row   = function ( $label, $installed, $zip ) use ( $rel ) {
		if ( ! $rel ) {
			$state = __( 'Could not reach GitHub', 'afsv-vrc-core' );
		} elseif ( ! $zip ) {
			$state = __( 'Not in the latest release', 'afsv-vrc-core' );
		} elseif ( version_compare( $rel['version'], $installed, '>' ) ) {
			$state = '<strong>' . esc_html__( 'Update available', 'afsv-vrc-core' ) . '</strong>';
		} else {
			$state = esc_html__( 'Up to date', 'afsv-vrc-core' );
		}
		printf( '<tr><th scope="row">%s</th><td>%s</td><td>%s</td><td>%s</td></tr>', esc_html( $label ), esc_html( $installed ? $installed : '—' ), esc_html( $rel ? $rel['version'] : '—' ), $state ); // phpcs:ignore WordPress.Security.EscapeOutput
	};
	?>
<div class="wrap">
  <h1><?php esc_html_e( 'AFSV VRC updates', 'afsv-vrc-core' ); ?></h1>
	<?php if ( $checked ) : ?><div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Checked GitHub.', 'afsv-vrc-core' ); ?></p></div><?php endif; ?>
  <p><?php printf( /* translators: %s: repository */ esc_html__( 'Updates for the AFSV VRC plugin and theme come from the releases of github.com/%s. When a new release is published it appears under Dashboard → Updates. Nothing installs until you click Update.', 'afsv-vrc-core' ), esc_html( AFSV_UPDATE_REPO ) ); ?></p>
  <table class="widefat striped" style="max-width:720px">
    <thead><tr><th></th><th><?php esc_html_e( 'Installed', 'afsv-vrc-core' ); ?></th><th><?php esc_html_e( 'Latest release', 'afsv-vrc-core' ); ?></th><th><?php esc_html_e( 'Status', 'afsv-vrc-core' ); ?></th></tr></thead>
    <tbody>
	<?php
	$row( __( 'AFSV VRC Core (plugin)', 'afsv-vrc-core' ), AFSV_CORE_VERSION, $rel ? $rel['plugin_zip'] : '' );
	$row( __( 'AFSV VRC (theme)', 'afsv-vrc-core' ), $theme, $rel ? $rel['theme_zip'] : '' );
	?>
    </tbody>
  </table>
	<?php if ( $rel && $rel['notes'] ) : ?>
  <h2><?php esc_html_e( 'What is in the latest release', 'afsv-vrc-core' ); ?></h2>
  <div style="max-width:720px"><?php echo wp_kses_post( wpautop( esc_html( $rel['notes'] ) ) ); ?></div>
	<?php endif; ?>
  <form method="post" style="margin-top:20px">
	<?php wp_nonce_field( 'afsv_updates_check', 'afsv_updates_nonce' ); ?>
	<?php submit_button( __( 'Check GitHub now', 'afsv-vrc-core' ), 'secondary', 'check', false ); ?>
    <a class="button button-primary" href="<?php echo esc_url( admin_url( 'update-core.php' ) ); ?>"><?php esc_html_e( 'Go to Dashboard → Updates', 'afsv-vrc-core' ); ?></a>
  </form>
</div>
	<?php
}
