<?php
/**
 * Private preview gate ("Coming soon").
 *
 * When switched on (Settings → Coming soon & preview code), visitors see the coming-soon landing page
 * (chrome/part-gate.html) instead of the site. They get in by:
 *   - being logged in to WordPress with at least Contributor rights (admins, editors…); or
 *   - entering the preview code, which sets a signed cookie for 30 days.
 * Changing the code signs every preview visitor out (their cookies stop matching).
 *
 * Never gated: wp-admin, wp-login.php, the REST API (forms, the connector, deploy endpoints), admin-ajax,
 * cron, robots.txt and the favicon. The landing page is served with noindex.
 *
 * @package AFSV_VRC
 */

defined( 'ABSPATH' ) || exit;

const AFSV_GATE_OPTION = 'afsv_gate';
const AFSV_GATE_COOKIE = 'afsv_preview';
const AFSV_GATE_DAYS   = 30;

function afsv_gate_settings() {
	$s = get_option( AFSV_GATE_OPTION, array() );
	return wp_parse_args( is_array( $s ) ? $s : array(), array( 'enabled' => 0, 'code' => '', 'ver' => 1 ) );
}

/** Signed cookie value for a given expiry: "<expiry>.<hmac>"; tied to the current code version. */
function afsv_gate_token( $expires, $ver ) {
	return $expires . '.' . hash_hmac( 'sha256', 'afsv-preview|' . $ver . '|' . $expires, wp_salt( 'auth' ) );
}

function afsv_gate_has_cookie( $s ) {
	if ( empty( $_COOKIE[ AFSV_GATE_COOKIE ] ) ) {
		return false;
	}
	$raw = sanitize_text_field( wp_unslash( $_COOKIE[ AFSV_GATE_COOKIE ] ) );
	$exp = (int) strtok( $raw, '.' );
	return $exp > time() && hash_equals( afsv_gate_token( $exp, (int) $s['ver'] ), $raw );
}

function afsv_gate_client_ip() {
	return isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '0';
}

add_action( 'template_redirect', function () {
	$s = afsv_gate_settings();
	if ( empty( $s['enabled'] ) || '' === $s['code'] ) {
		return;
	}
	if ( is_robots() || is_favicon() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}
	if ( is_user_logged_in() && current_user_can( 'edit_posts' ) ) {
		return;
	}
	if ( afsv_gate_has_cookie( $s ) ) {
		return;
	}

	$error = '';
	if ( 'POST' === ( isset( $_SERVER['REQUEST_METHOD'] ) ? $_SERVER['REQUEST_METHOD'] : '' ) && isset( $_POST['afsv_access_code'] ) ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$key   = 'afsv_gate_tries_' . md5( afsv_gate_client_ip() );
		$tries = (int) get_transient( $key );
		if ( $tries >= 10 ) {
			$error = __( 'Too many attempts. Please wait 15 minutes and try again.', 'afsv-vrc' );
		} elseif ( ! isset( $_POST['afsv_gate_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['afsv_gate_nonce'] ) ), 'afsv_gate' ) ) {
			$error = __( 'Your session expired. Please enter the code again.', 'afsv-vrc' );
		} else {
			$given = strtolower( trim( sanitize_text_field( wp_unslash( $_POST['afsv_access_code'] ) ) ) );
			if ( '' !== $given && hash_equals( strtolower( trim( (string) $s['code'] ) ), $given ) ) {
				delete_transient( $key );
				$exp = time() + AFSV_GATE_DAYS * DAY_IN_SECONDS;
				setcookie(
					AFSV_GATE_COOKIE,
					afsv_gate_token( $exp, (int) $s['ver'] ),
					array( 'expires' => $exp, 'path' => COOKIEPATH ? COOKIEPATH : '/', 'domain' => COOKIE_DOMAIN, 'secure' => is_ssl(), 'httponly' => true, 'samesite' => 'Lax' )
				);
				$to = isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/';
				wp_safe_redirect( remove_query_arg( 'nointro', $to ), 303 );
				exit;
			}
			set_transient( $key, $tries + 1, 15 * MINUTE_IN_SECONDS );
			$error = __( 'That code didn’t work. Please check it and try again.', 'afsv-vrc' );
		}
	}
	afsv_gate_render( $error );
	exit;
}, 0 );

function afsv_gate_render( $error = '' ) {
	$file = get_stylesheet_directory() . '/chrome/part-gate.html';
	$html = file_exists( $file ) ? afsv_fill( (string) file_get_contents( $file ) ) : '<main class="gate"><div class="gate__inner"><h1 class="gate__title">Coming soon.</h1></div></main>';
	if ( $error ) {
		// Don't replay the letter intro after a failed attempt.
		$html = preg_replace( '#<!--gate:intro-->.*?<!--/gate:intro-->#s', '', $html );
	}
	$html = str_replace( '<!--gate:error-->', esc_html( $error ), $html );
	$html = str_replace( '<!--gate:fields-->', wp_nonce_field( 'afsv_gate', 'afsv_gate_nonce', false, false ), $html );
	$css  = get_stylesheet_directory_uri() . '/assets/css/site.css?ver=' . rawurlencode( AFSV_THEME_VERSION );
	$js   = get_stylesheet_directory_uri() . '/assets/js/intro.js?ver=' . rawurlencode( AFSV_THEME_VERSION );
	$font = get_stylesheet_directory_uri() . '/assets/fonts/montserrat-latin.woff2';
	$icon = get_stylesheet_directory_uri() . '/assets/img/favicon.svg';

	status_header( 200 );
	nocache_headers();
	header( 'X-Robots-Tag: noindex, nofollow', true );
	header( 'Content-Type: text/html; charset=' . get_option( 'blog_charset' ) );
	?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php echo esc_html__( 'Coming soon | AFSV VRC', 'afsv-vrc' ); ?></title>
<meta name="description" content="<?php echo esc_attr__( 'AFSV VRC Global Development Group Limited: a proposed AI-Driven Sports Village for Whitby, Ontario. Website coming soon.', 'afsv-vrc' ); ?>">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#091E36">
<link rel="icon" href="<?php echo esc_url( $icon ); ?>" type="image/svg+xml">
<link rel="preload" href="<?php echo esc_url( $font ); ?>" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="<?php echo esc_url( $css ); ?>">
</head>
<body class="is-gate">
	<?php echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- theme-generated design markup with escaped placeholders. ?>
<script src="<?php echo esc_url( $js ); ?>" defer></script>
</body>
</html>
	<?php
}

/* ───────── Settings → Coming soon & preview code ───────── */
add_action( 'admin_menu', function () {
	add_options_page( __( 'Coming soon & preview code', 'afsv-vrc' ), __( 'Coming soon', 'afsv-vrc' ), 'manage_options', 'afsv-gate', 'afsv_gate_screen' );
} );

function afsv_gate_screen() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$s     = afsv_gate_settings();
	$saved = false;
	if ( isset( $_POST['afsv_gate_save'] ) && check_admin_referer( 'afsv_gate_settings' ) ) {
		$code = isset( $_POST['afsv_gate_code'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['afsv_gate_code'] ) ) ) : '';
		$new  = array(
			'enabled' => ! empty( $_POST['afsv_gate_enabled'] ) && '' !== $code ? 1 : 0,
			'code'    => $code,
			'ver'     => (int) $s['ver'],
		);
		if ( $code !== $s['code'] || ! empty( $_POST['afsv_gate_signout'] ) ) {
			$new['ver'] = (int) $s['ver'] + 1; // invalidates every preview cookie
		}
		update_option( AFSV_GATE_OPTION, $new, false );
		$s     = $new;
		$saved = true;
	}
	?>
<div class="wrap">
	<h1><?php esc_html_e( 'Coming soon & preview code', 'afsv-vrc' ); ?></h1>
	<?php if ( $saved ) : ?>
	<div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Saved.', 'afsv-vrc' ); ?></p></div>
	<?php endif; ?>
	<p><?php esc_html_e( 'When this is on, the public sees the AFSV VRC coming-soon page. People with the preview code can enter it to see the full site for 30 days on that browser. Anyone logged in to WordPress (contributor and above) always sees the full site, and wp-admin is never affected.', 'afsv-vrc' ); ?></p>
	<form method="post">
		<?php wp_nonce_field( 'afsv_gate_settings' ); ?>
		<table class="form-table" role="presentation"><tbody>
			<tr><th scope="row"><?php esc_html_e( 'Coming soon page', 'afsv-vrc' ); ?></th>
				<td><label><input type="checkbox" name="afsv_gate_enabled" value="1" <?php checked( ! empty( $s['enabled'] ) ); ?>> <?php esc_html_e( 'Show the coming-soon page to the public', 'afsv-vrc' ); ?></label>
				<p class="description"><?php echo empty( $s['enabled'] ) ? esc_html__( 'Currently OFF: the full site is public.', 'afsv-vrc' ) : esc_html__( 'Currently ON: the public sees the coming-soon page.', 'afsv-vrc' ); ?></p></td></tr>
			<tr><th scope="row"><label for="afsv-gate-code"><?php esc_html_e( 'Preview code', 'afsv-vrc' ); ?></label></th>
				<td><input type="text" class="regular-text" id="afsv-gate-code" name="afsv_gate_code" value="<?php echo esc_attr( $s['code'] ); ?>" autocomplete="off" spellcheck="false">
				<p class="description"><?php esc_html_e( 'Share this with people who should see the site. Not case-sensitive. Changing it signs everyone out of the preview. The page cannot be switched on without a code.', 'afsv-vrc' ); ?></p></td></tr>
			<tr><th scope="row"><?php esc_html_e( 'Sign everyone out', 'afsv-vrc' ); ?></th>
				<td><label><input type="checkbox" name="afsv_gate_signout" value="1"> <?php esc_html_e( 'End all current previews now (keeps the same code)', 'afsv-vrc' ); ?></label></td></tr>
		</tbody></table>
		<p class="submit"><button type="submit" name="afsv_gate_save" value="1" class="button button-primary"><?php esc_html_e( 'Save', 'afsv-vrc' ); ?></button>
		<a class="button" href="<?php echo esc_url( add_query_arg( 'afsv_gate_preview', '1', home_url( '/' ) ) ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Preview the coming-soon page', 'afsv-vrc' ); ?></a></p>
	</form>
</div>
	<?php
}

/* Admins can view the landing page itself: /?afsv_gate_preview=1 */
add_action( 'template_redirect', function () {
	if ( isset( $_GET['afsv_gate_preview'] ) && current_user_can( 'manage_options' ) ) { // phpcs:ignore WordPress.Security.NonceVerification
		afsv_gate_render();
		exit;
	}
}, -1 );

/* Admin bar reminder while the gate is on. */
add_action( 'admin_bar_menu', function ( $bar ) {
	$s = afsv_gate_settings();
	if ( ! empty( $s['enabled'] ) && current_user_can( 'manage_options' ) ) {
		$bar->add_node( array( 'id' => 'afsv-gate', 'title' => __( 'Coming soon: ON', 'afsv-vrc' ), 'href' => admin_url( 'options-general.php?page=afsv-gate' ) ) );
	}
}, 100 );
