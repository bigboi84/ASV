<?php
/**
 * Form submissions from the AFSV Interest Form widget.
 *
 * Submissions are saved as private "Form submissions" in wp-admin and emailed
 * to the address set in Settings → General (or the widget's own recipient).
 * Spam protection: a hidden honeypot field, a per-IP rate limit and (optional) Cloudflare Turnstile.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

add_action( 'init', function () {
	register_post_type(
		'afsv_submission',
		array(
			'labels'          => array(
				'name'          => __( 'Form submissions', 'afsv-vrc-core' ),
				'singular_name' => __( 'Form submission', 'afsv-vrc-core' ),
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'menu_icon'       => 'dashicons-email-alt',
			'menu_position'   => 23,
			'supports'        => array( 'title', 'editor' ),
			'capability_type' => 'post',
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap'    => true,
		)
	);
} );

add_action( 'rest_api_init', function () {
	register_rest_route(
		'afsv/v1',
		'/forms/(?P<form>[a-z0-9-]+)',
		array(
			'methods'             => 'POST',
			'permission_callback' => '__return_true',
			'callback'            => 'afsv_core_handle_form',
		)
	);
} );

/* ───────── Spam protection: Cloudflare Turnstile ───────── */

/**
 * Turnstile settings. The keys come from Cloudflare (Turnstile → your widget); they can also be
 * defined in wp-config.php as AFSV_TURNSTILE_SITE_KEY / AFSV_TURNSTILE_SECRET.
 */
function afsv_core_turnstile() {
	$o      = get_option( 'afsv_turnstile', array() );
	$o      = is_array( $o ) ? $o : array();
	$site   = defined( 'AFSV_TURNSTILE_SITE_KEY' ) ? (string) AFSV_TURNSTILE_SITE_KEY : ( isset( $o['site'] ) ? (string) $o['site'] : '' );
	$secret = defined( 'AFSV_TURNSTILE_SECRET' ) ? (string) AFSV_TURNSTILE_SECRET : ( isset( $o['secret'] ) ? (string) $o['secret'] : '' );
	$on     = ! empty( $o['enabled'] );
	return array(
		'on'      => $on,
		'site'    => $site,
		'secret'  => $secret,
		'enabled' => $on && $site && $secret,
	);
}

/** Cloudflare's published address ranges (refreshed daily; this list is the fallback). */
function afsv_core_cloudflare_ranges() {
	$c = get_site_transient( 'afsv_cf_ranges' );
	if ( is_array( $c ) && $c ) {
		return $c;
	}
	$out = array();
	foreach ( array( 'https://www.cloudflare.com/ips-v4', 'https://www.cloudflare.com/ips-v6' ) as $url ) {
		$res = wp_remote_get( $url, array( 'timeout' => 6 ) );
		if ( ! is_wp_error( $res ) && 200 === (int) wp_remote_retrieve_response_code( $res ) ) {
			foreach ( preg_split( '/\s+/', trim( wp_remote_retrieve_body( $res ) ) ) as $r ) {
				if ( preg_match( '#^[0-9a-f:.]+/\d{1,3}$#i', $r ) ) {
					$out[] = $r;
				}
			}
		}
	}
	if ( count( $out ) < 10 ) {
		$out = array_merge(
			array(
			'173.245.48.0/20',
			'103.21.244.0/22',
			'103.22.200.0/22',
			'103.31.4.0/22',
			'141.101.64.0/18',
			'108.162.192.0/18',
			'190.93.240.0/20',
			'188.114.96.0/20',
			'197.234.240.0/22',
			'198.41.128.0/17',
			'162.158.0.0/15',
			'104.16.0.0/13',
			'104.24.0.0/14',
			'172.64.0.0/13',
			'131.0.72.0/22',
		),
			array(
			'2400:cb00::/32',
			'2606:4700::/32',
			'2803:f800::/32',
			'2405:b500::/32',
			'2405:8100::/32',
			'2a06:98c0::/29',
			'2c0f:f248::/32',
		)
		);
	}
	set_site_transient( 'afsv_cf_ranges', $out, DAY_IN_SECONDS );
	return $out;
}

function afsv_core_ip_in( $ip, $cidr ) {
	$parts = explode( '/', $cidr, 2 );
	$a     = @inet_pton( $ip );
	$b     = @inet_pton( $parts[0] );
	if ( false === $a || false === $b || strlen( $a ) !== strlen( $b ) ) {
		return false;
	}
	$bits  = isset( $parts[1] ) ? (int) $parts[1] : strlen( $a ) * 8;
	$bytes = intdiv( $bits, 8 );
	$rem   = $bits % 8;
	if ( substr( $a, 0, $bytes ) !== substr( $b, 0, $bytes ) ) {
		return false;
	}
	if ( $rem ) {
		$mask = ( 0xFF << ( 8 - $rem ) ) & 0xFF;
		return ( ord( $a[ $bytes ] ) & $mask ) === ( ord( $b[ $bytes ] ) & $mask );
	}
	return true;
}

/**
 * The visitor's IP. Cloudflare passes it in CF-Connecting-IP, which is only believable when the request really came
 * from Cloudflare; a direct call to the server could put anything in that header.
 */
function afsv_core_client_ip() {
	$remote = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
	if ( ! empty( $_SERVER['HTTP_CF_CONNECTING_IP'] ) && filter_var( $remote, FILTER_VALIDATE_IP ) ) {
		$cf = sanitize_text_field( wp_unslash( $_SERVER['HTTP_CF_CONNECTING_IP'] ) );
		if ( filter_var( $cf, FILTER_VALIDATE_IP ) ) {
			foreach ( afsv_core_cloudflare_ranges() as $range ) {
				if ( afsv_core_ip_in( $remote, $range ) ) {
					return $cf;
				}
			}
		}
	}
	return filter_var( $remote, FILTER_VALIDATE_IP ) ? $remote : '';
}

/** True when Cloudflare confirms the token, false when it rejects it, WP_Error when Cloudflare cannot be reached. */
function afsv_core_turnstile_verify( $token ) {
	$t = afsv_core_turnstile();
	if ( ! $token ) {
		return false;
	}
	$res = wp_remote_post(
		'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		array(
			'timeout' => 10,
			'body'    => array(
				'secret'   => $t['secret'],
				'response' => $token,
				'remoteip' => afsv_core_client_ip(),
			),
		)
	);
	if ( is_wp_error( $res ) ) {
		return $res;
	}
	$d = json_decode( wp_remote_retrieve_body( $res ), true );
	return is_array( $d ) && ! empty( $d['success'] );
}

add_action( 'wp_enqueue_scripts', function () {
	$t = afsv_core_turnstile();
	if ( ! $t['enabled'] ) {
		return;
	}
	wp_enqueue_script( 'cf-turnstile', 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', array(), null, array( 'strategy' => 'defer', 'in_footer' => true ) ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters
	wp_enqueue_script( 'afsv-turnstile', AFSV_CORE_URL . 'assets/turnstile.js', array( 'cf-turnstile' ), AFSV_CORE_VERSION, array( 'strategy' => 'defer', 'in_footer' => true ) );
	wp_add_inline_script( 'afsv-turnstile', 'window.AFSV_TURNSTILE = ' . wp_json_encode( array( 'key' => $t['site'], 'host' => strtolower( (string) wp_parse_url( get_option( 'home' ), PHP_URL_HOST ) ) ) ) . ';', 'before' );
}, 30 );

function afsv_core_form_endpoint( $form_id ) {
	return rest_url( 'afsv/v1/forms/' . sanitize_key( $form_id ) );
}

function afsv_core_handle_form( WP_REST_Request $req ) {
	$params = $req->get_body_params();

	// Honeypot: real people never fill the hidden "website" field.
	if ( ! empty( $params['afsv_website'] ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}

	// Cloudflare Turnstile (when switched on in Form submissions → Settings).
	if ( afsv_core_turnstile()['enabled'] ) {
		$ok = afsv_core_turnstile_verify( isset( $params['cf-turnstile-response'] ) ? sanitize_text_field( wp_unslash( $params['cf-turnstile-response'] ) ) : '' );
		if ( true !== $ok ) {
			return new WP_Error( 'afsv_turnstile', __( 'We could not confirm you are human. Please wait a moment and try again, or email info@afsvvrc.com.', 'afsv-vrc-core' ), array( 'status' => 403 ) );
		}
	}

	$ip  = afsv_core_client_ip();
	$key = 'afsv_form_rl_' . md5( $ip );
	$n   = (int) get_transient( $key );
	if ( $n >= 5 ) {
		return new WP_Error( 'afsv_rate_limited', __( 'Too many submissions. Please try again later.', 'afsv-vrc-core' ), array( 'status' => 429 ) );
	}
	set_transient( $key, $n + 1, 10 * MINUTE_IN_SECONDS );

	$form   = sanitize_key( $req['form'] );
	$labels = isset( $params['afsv_labels'] ) ? json_decode( wp_unslash( $params['afsv_labels'] ), true ) : array();
	$labels = is_array( $labels ) ? $labels : array();
	$lines  = array();
	$name   = '';
	$email  = '';
	foreach ( $params as $k => $v ) {
		if ( 0 === strpos( $k, 'afsv_' ) || 'cf-turnstile-response' === $k ) {
			continue;
		}
		$k     = sanitize_key( $k );
		$v     = is_array( $v ) ? implode( ', ', array_map( 'sanitize_text_field', $v ) ) : sanitize_textarea_field( wp_unslash( $v ) );
		$label = isset( $labels[ $k ] ) ? sanitize_text_field( $labels[ $k ] ) : $k;
		if ( ! $name && false !== strpos( $k, 'name' ) ) {
			$name = $v;
		}
		if ( ! $email && is_email( $v ) ) {
			$email = $v;
		}
		$lines[] = $label . ': ' . $v;
	}
	if ( ! $lines ) {
		return new WP_Error( 'afsv_empty', __( 'The form was empty.', 'afsv-vrc-core' ), array( 'status' => 400 ) );
	}

	$heading = ! empty( $params['afsv_title'] ) ? sanitize_text_field( wp_unslash( $params['afsv_title'] ) ) : ucwords( str_replace( '-', ' ', $form ) );
	$title   = sprintf( '%s — %s', $heading, $name ? $name : $email );
	if ( ! empty( $params['afsv_page'] ) ) {
		$lines[] = 'Page: ' . esc_url_raw( wp_unslash( $params['afsv_page'] ) );
	}
	// Consent record: each tick box, whether it was ticked and the wording shown, with the date and form.
	$consents = isset( $params['afsv_consents'] ) ? json_decode( wp_unslash( $params['afsv_consents'] ), true ) : array();
	$record   = array();
	if ( is_array( $consents ) ) {
		foreach ( array_slice( $consents, 0, 10 ) as $c ) {
			if ( ! is_array( $c ) || empty( $c['field'] ) ) {
				continue;
			}
			$record[] = array(
				'field'    => sanitize_key( $c['field'] ),
				'selected' => ! empty( $c['selected'] ),
				'wording'  => sanitize_text_field( isset( $c['wording'] ) ? $c['wording'] : '' ),
			);
		}
	}
	if ( $record ) {
		$lines[] = '';
		$lines[] = 'Consent record (' . gmdate( 'Y-m-d H:i' ) . ' UTC, form: ' . $form . ')';
		foreach ( $record as $c ) {
			$lines[] = ( $c['selected'] ? 'Yes' : 'No' ) . ' — ' . $c['wording'];
		}
	}
	$body = implode( "\n", $lines );
	$sub  = wp_insert_post(
		array(
			'post_type'    => 'afsv_submission',
			'post_status'  => 'private',
			'post_title'   => $title,
			'post_content' => $body,
		)
	);
	if ( $sub && ! is_wp_error( $sub ) ) {
		update_post_meta( $sub, 'afsv_form', $form );
		update_post_meta( $sub, 'afsv_email', $email );
		if ( $record ) {
			update_post_meta( $sub, 'afsv_consents', wp_json_encode( $record ) );
		}
	}

	$cfg     = afsv_core_form_config( $form );
	$from    = afsv_core_form_from_header();
	$headers = array_filter( array( $from, $email ? 'Reply-To: ' . $email : '' ) );
	$notify  = wp_mail( $cfg['to'], '[AFSV VRC] ' . $title, $body . "\n\n" . home_url( '/' ), $headers );
	if ( $sub && ! is_wp_error( $sub ) ) {
		update_post_meta( $sub, 'afsv_notified', $notify ? implode( ', ', $cfg['to'] ) : 'failed' );
	}

	// Auto-reply to the person who filled in the form.
	if ( $cfg['ar_enabled'] && $email ) {
		$vars = array(
			'{name}'    => $name ? $name : __( 'there', 'afsv-vrc-core' ),
			'{email}'   => $email,
			'{form}'    => $heading,
			'{site}'    => wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ),
			'{answers}' => $body,
		);
		wp_mail( $email, strtr( $cfg['ar_subject'], $vars ), strtr( $cfg['ar_body'], $vars ), array_filter( array( $from, 'Reply-To: ' . $cfg['to'][0] ) ) );
	}

	return new WP_REST_Response( array( 'ok' => true ), 200 );
}

/* ───────── Settings: recipients, auto-replies, sender ───────── */

const AFSV_FORM_DEFAULTS = array(
	'to'         => 'info@afsvvrc.com',
	'from_name'  => 'AFSV VRC',
	'from_email' => '',
	'ar_enabled' => 1,
	'ar_subject' => 'Thank you, {name} — we received your message',
	'ar_body'    => "Hi {name},\n\nThank you for getting in touch with AFSV VRC. We've received your submission (\"{form}\") and a member of our team will be in touch soon.\n\nFor your records, here is what you sent:\n\n{answers}\n\nWarm regards,\nThe AFSV VRC team\ninfo@afsvvrc.com",
);

function afsv_core_form_settings() {
	$s = get_option( 'afsv_forms_settings', array() );
	$s = is_array( $s ) ? $s : array();
	$s = array_merge( AFSV_FORM_DEFAULTS, $s );
	$s['forms'] = isset( $s['forms'] ) && is_array( $s['forms'] ) ? $s['forms'] : array();
	return $s;
}

/** Emails as an array from a comma/space/newline separated string. */
function afsv_core_emails( $str ) {
	return array_values( array_filter( array_map( 'sanitize_email', preg_split( '/[\s,;]+/', (string) $str ) ), 'is_email' ) );
}

/** Effective settings for one form: its own values where set, otherwise the defaults. */
function afsv_core_form_config( $form ) {
	$s  = afsv_core_form_settings();
	$f  = isset( $s['forms'][ $form ] ) ? $s['forms'][ $form ] : array();
	$to = afsv_core_emails( ! empty( $f['to'] ) ? $f['to'] : $s['to'] );
	if ( ! $to ) {
		$legacy = get_option( 'afsv_form_recipient_' . $form );
		$to     = is_email( $legacy ) ? array( $legacy ) : array( get_option( 'admin_email' ) );
	}
	$mode = isset( $f['ar'] ) ? $f['ar'] : 'default'; // default | on | off
	return array(
		'to'         => $to,
		'ar_enabled' => 'off' !== $mode && ( 'on' === $mode || ! empty( $s['ar_enabled'] ) ),
		'ar_subject' => ! empty( $f['ar_subject'] ) ? $f['ar_subject'] : $s['ar_subject'],
		'ar_body'    => ! empty( $f['ar_body'] ) ? $f['ar_body'] : $s['ar_body'],
	);
}

function afsv_core_form_from_header() {
	$s = afsv_core_form_settings();
	if ( ! $s['from_email'] || ! is_email( $s['from_email'] ) ) {
		return '';
	}
	return sprintf( 'From: %s <%s>', str_replace( array( "\r", "\n", '<', '>' ), '', $s['from_name'] ? $s['from_name'] : 'AFSV VRC' ), $s['from_email'] );
}

/** The site's forms (from the bundled content) plus any form that has received submissions. */
function afsv_core_known_forms() {
	$file  = AFSV_CORE_DIR . 'content/forms.json';
	$list  = file_exists( $file ) ? json_decode( file_get_contents( $file ), true ) : array(); // phpcs:ignore
	$forms = array();
	foreach ( (array) $list as $f ) {
		$forms[ $f['id'] ] = $f;
	}
	$s = afsv_core_form_settings();
	foreach ( array_keys( $s['forms'] ) as $id ) {
		if ( ! isset( $forms[ $id ] ) ) {
			$forms[ $id ] = array( 'id' => $id, 'title' => $id, 'pages' => array() );
		}
	}
	return $forms;
}

add_action( 'admin_menu', function () {
	add_submenu_page( 'edit.php?post_type=afsv_submission', __( 'Form settings', 'afsv-vrc-core' ), __( 'Settings', 'afsv-vrc-core' ), 'manage_options', 'afsv-form-settings', 'afsv_core_form_settings_screen' );
} );

/* Show which form, recipients and status on each submission in the list. */
add_filter( 'manage_afsv_submission_posts_columns', function ( $cols ) {
	return array_slice( $cols, 0, 2, true ) + array( 'afsv_form' => __( 'Form', 'afsv-vrc-core' ), 'afsv_notified' => __( 'Emailed to', 'afsv-vrc-core' ) ) + $cols;
} );
add_action( 'manage_afsv_submission_posts_custom_column', function ( $col, $id ) {
	if ( 'afsv_form' === $col || 'afsv_notified' === $col ) {
		echo esc_html( (string) get_post_meta( $id, $col, true ) );
	}
}, 10, 2 );

function afsv_core_form_settings_screen() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$saved = false;
	$test  = '';
	if ( isset( $_POST['afsv_forms_nonce'] ) && wp_verify_nonce( sanitize_key( $_POST['afsv_forms_nonce'] ), 'afsv_forms_save' ) ) {
		$in  = wp_unslash( $_POST ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$new = array(
			'to'         => implode( ', ', afsv_core_emails( isset( $in['to'] ) ? $in['to'] : '' ) ),
			'from_name'  => sanitize_text_field( isset( $in['from_name'] ) ? $in['from_name'] : '' ),
			'from_email' => sanitize_email( isset( $in['from_email'] ) ? $in['from_email'] : '' ),
			'ar_enabled' => empty( $in['ar_enabled'] ) ? 0 : 1,
			'ar_subject' => sanitize_text_field( isset( $in['ar_subject'] ) ? $in['ar_subject'] : '' ),
			'ar_body'    => sanitize_textarea_field( isset( $in['ar_body'] ) ? $in['ar_body'] : '' ),
			'forms'      => array(),
		);
		foreach ( isset( $in['forms'] ) && is_array( $in['forms'] ) ? $in['forms'] : array() as $id => $f ) {
			$id                 = sanitize_key( $id );
			$new['forms'][ $id ] = array(
				'to'         => implode( ', ', afsv_core_emails( isset( $f['to'] ) ? $f['to'] : '' ) ),
				'ar'         => in_array( isset( $f['ar'] ) ? $f['ar'] : 'default', array( 'default', 'on', 'off' ), true ) ? $f['ar'] : 'default',
				'ar_subject' => sanitize_text_field( isset( $f['ar_subject'] ) ? $f['ar_subject'] : '' ),
				'ar_body'    => sanitize_textarea_field( isset( $f['ar_body'] ) ? $f['ar_body'] : '' ),
			);
		}
		update_option( 'afsv_forms_settings', $new, false );
		$ts  = get_option( 'afsv_turnstile', array() );
		$ts  = is_array( $ts ) ? $ts : array();
		$sec = isset( $in['ts_secret'] ) ? trim( sanitize_text_field( $in['ts_secret'] ) ) : '';
		update_option(
			'afsv_turnstile',
			array(
				'enabled' => empty( $in['ts_enabled'] ) ? 0 : 1,
				'site'    => isset( $in['ts_site'] ) ? trim( sanitize_text_field( $in['ts_site'] ) ) : '',
				'secret'  => '' !== $sec ? $sec : ( isset( $ts['secret'] ) ? $ts['secret'] : '' ), // empty = keep the saved secret
			),
			false
		);
		$saved = true;
		if ( ! empty( $in['send_test'] ) ) {
			$cfg  = afsv_core_form_config( '' );
			$ok   = wp_mail( $cfg['to'], '[AFSV VRC] Test email from the form settings', "This is a test from Form submissions → Settings.\n\nIf you received this, form notifications from " . home_url( '/' ) . ' are being delivered.', array_filter( array( afsv_core_form_from_header() ) ) );
			$test = $ok ? sprintf( __( 'Test email handed to the mail server for %s. Check the inbox (and spam folder).', 'afsv-vrc-core' ), implode( ', ', $cfg['to'] ) ) : __( 'WordPress could not send the test email. Install and configure an SMTP plugin (e.g. WP Mail SMTP) for reliable delivery.', 'afsv-vrc-core' );
		}
	}
	$s     = afsv_core_form_settings();
	$forms = afsv_core_known_forms();
	?>
<div class="wrap">
  <h1><?php esc_html_e( 'Form settings', 'afsv-vrc-core' ); ?></h1>
	<?php if ( $saved ) : ?><div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Settings saved.', 'afsv-vrc-core' ); ?></p></div><?php endif; ?>
	<?php if ( $test ) : ?><div class="notice notice-info is-dismissible"><p><?php echo esc_html( $test ); ?></p></div><?php endif; ?>
  <p><?php esc_html_e( 'Every form on the site saves its entries under Form submissions and emails them to the recipients below. Each form can have its own recipients and its own auto-reply; leave a field empty to use the default.', 'afsv-vrc-core' ); ?></p>
  <form method="post">
	<?php wp_nonce_field( 'afsv_forms_save', 'afsv_forms_nonce' ); ?>
    <h2><?php esc_html_e( 'Defaults', 'afsv-vrc-core' ); ?></h2>
    <table class="form-table" role="presentation">
      <tr><th scope="row"><label for="afsv-to"><?php esc_html_e( 'Send submissions to', 'afsv-vrc-core' ); ?></label></th>
        <td><input type="text" class="regular-text" id="afsv-to" name="to" value="<?php echo esc_attr( $s['to'] ); ?>"><p class="description"><?php esc_html_e( 'One or more email addresses, separated by commas.', 'afsv-vrc-core' ); ?></p></td></tr>
      <tr><th scope="row"><label for="afsv-from-name"><?php esc_html_e( 'From name', 'afsv-vrc-core' ); ?></label></th>
        <td><input type="text" class="regular-text" id="afsv-from-name" name="from_name" value="<?php echo esc_attr( $s['from_name'] ); ?>"></td></tr>
      <tr><th scope="row"><label for="afsv-from-email"><?php esc_html_e( 'From email', 'afsv-vrc-core' ); ?></label></th>
        <td><input type="email" class="regular-text" id="afsv-from-email" name="from_email" value="<?php echo esc_attr( $s['from_email'] ); ?>" placeholder="<?php esc_attr_e( 'Leave empty to use the WordPress default', 'afsv-vrc-core' ); ?>"><p class="description"><?php esc_html_e( 'Use an address on your own domain (e.g. no-reply@afsvvrc.com) so emails are not marked as spam.', 'afsv-vrc-core' ); ?></p></td></tr>
      <tr><th scope="row"><?php esc_html_e( 'Auto-reply', 'afsv-vrc-core' ); ?></th>
        <td><label><input type="checkbox" name="ar_enabled" value="1" <?php checked( $s['ar_enabled'] ); ?>> <?php esc_html_e( 'Send an automatic reply to the person who filled in the form', 'afsv-vrc-core' ); ?></label></td></tr>
      <tr><th scope="row"><label for="afsv-ar-subject"><?php esc_html_e( 'Auto-reply subject', 'afsv-vrc-core' ); ?></label></th>
        <td><input type="text" class="large-text" id="afsv-ar-subject" name="ar_subject" value="<?php echo esc_attr( $s['ar_subject'] ); ?>"></td></tr>
      <tr><th scope="row"><label for="afsv-ar-body"><?php esc_html_e( 'Auto-reply message', 'afsv-vrc-core' ); ?></label></th>
        <td><textarea class="large-text" rows="9" id="afsv-ar-body" name="ar_body"><?php echo esc_textarea( $s['ar_body'] ); ?></textarea>
        <p class="description"><?php esc_html_e( 'Placeholders: {name}, {email}, {form} (form title), {site}, {answers} (everything they sent).', 'afsv-vrc-core' ); ?></p></td></tr>
    </table>

    <h2><?php esc_html_e( 'Spam protection (Cloudflare Turnstile)', 'afsv-vrc-core' ); ?></h2>
	<?php $ts = afsv_core_turnstile(); ?>
    <p><?php esc_html_e( 'Turnstile is a free Cloudflare check that stops bots from submitting the forms. Visitors normally see nothing; only a suspicious visit is asked to confirm. Create a widget in Cloudflare (Turnstile), then paste its Site key and Secret key here.', 'afsv-vrc-core' ); ?></p>
    <table class="form-table" role="presentation">
      <tr><th scope="row"><?php esc_html_e( 'Status', 'afsv-vrc-core' ); ?></th>
        <td><strong><?php echo $ts['enabled'] ? esc_html__( 'ON — forms are protected', 'afsv-vrc-core' ) : esc_html__( 'OFF', 'afsv-vrc-core' ); ?></strong>
		<?php if ( $ts['on'] && ! $ts['enabled'] ) : ?><br><span style="color:#b32d2e"><?php esc_html_e( 'Switched on, but both keys are needed.', 'afsv-vrc-core' ); ?></span><?php endif; ?></td></tr>
      <tr><th scope="row"><?php esc_html_e( 'Protect the forms', 'afsv-vrc-core' ); ?></th>
        <td><label><input type="checkbox" name="ts_enabled" value="1" <?php checked( $ts['on'] ); ?>> <?php esc_html_e( 'Require Cloudflare Turnstile on every form', 'afsv-vrc-core' ); ?></label></td></tr>
      <tr><th scope="row"><label for="afsv-ts-site"><?php esc_html_e( 'Site key', 'afsv-vrc-core' ); ?></label></th>
        <td><input type="text" class="regular-text" id="afsv-ts-site" name="ts_site" value="<?php echo esc_attr( $ts['site'] ); ?>" autocomplete="off" spellcheck="false"><p class="description"><?php esc_html_e( 'The public key. It appears in the page source.', 'afsv-vrc-core' ); ?></p></td></tr>
      <tr><th scope="row"><label for="afsv-ts-secret"><?php esc_html_e( 'Secret key', 'afsv-vrc-core' ); ?></label></th>
        <td><input type="password" class="regular-text" id="afsv-ts-secret" name="ts_secret" value="" autocomplete="new-password" spellcheck="false" placeholder="<?php echo $ts['secret'] ? esc_attr__( 'Saved — leave empty to keep it', 'afsv-vrc-core' ) : ''; ?>"><p class="description"><?php esc_html_e( 'Keep this private. It is never shown again after saving.', 'afsv-vrc-core' ); ?></p></td></tr>
    </table>

    <h2><?php esc_html_e( 'Per form', 'afsv-vrc-core' ); ?></h2>
    <p><?php esc_html_e( 'Optional. Set different recipients or a different auto-reply for a specific form.', 'afsv-vrc-core' ); ?></p>
	<?php
	foreach ( $forms as $id => $f ) :
		$v    = isset( $s['forms'][ $id ] ) ? $s['forms'][ $id ] : array();
		$open = ! empty( $v['to'] ) || ( isset( $v['ar'] ) && 'default' !== $v['ar'] ) || ! empty( $v['ar_subject'] ) || ! empty( $v['ar_body'] );
		$n    = 'forms[' . esc_attr( $id ) . ']';
		?>
    <details class="postbox" style="padding:0 16px;margin:0 0 10px"<?php echo $open ? ' open' : ''; ?>>
      <summary style="cursor:pointer;padding:12px 0;font-weight:600"><?php echo esc_html( $f['title'] ); ?> <span style="font-weight:400;color:#646970">— <?php echo esc_html( implode( ', ', (array) $f['pages'] ) ); ?> (<?php echo esc_html( $id ); ?>)</span></summary>
      <table class="form-table" role="presentation">
        <tr><th scope="row"><?php esc_html_e( 'Send to', 'afsv-vrc-core' ); ?></th><td><input type="text" class="regular-text" name="<?php echo $n; // phpcs:ignore ?>[to]" value="<?php echo esc_attr( isset( $v['to'] ) ? $v['to'] : '' ); ?>" placeholder="<?php echo esc_attr( $s['to'] ); ?>"></td></tr>
        <tr><th scope="row"><?php esc_html_e( 'Auto-reply', 'afsv-vrc-core' ); ?></th><td><select name="<?php echo $n; // phpcs:ignore ?>[ar]">
			<?php foreach ( array( 'default' => __( 'Use the default', 'afsv-vrc-core' ), 'on' => __( 'On', 'afsv-vrc-core' ), 'off' => __( 'Off', 'afsv-vrc-core' ) ) as $k => $label ) : ?>
          <option value="<?php echo esc_attr( $k ); ?>" <?php selected( isset( $v['ar'] ) ? $v['ar'] : 'default', $k ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
        </select></td></tr>
        <tr><th scope="row"><?php esc_html_e( 'Auto-reply subject', 'afsv-vrc-core' ); ?></th><td><input type="text" class="large-text" name="<?php echo $n; // phpcs:ignore ?>[ar_subject]" value="<?php echo esc_attr( isset( $v['ar_subject'] ) ? $v['ar_subject'] : '' ); ?>" placeholder="<?php esc_attr_e( 'Default subject', 'afsv-vrc-core' ); ?>"></td></tr>
        <tr><th scope="row"><?php esc_html_e( 'Auto-reply message', 'afsv-vrc-core' ); ?></th><td><textarea class="large-text" rows="5" name="<?php echo $n; // phpcs:ignore ?>[ar_body]" placeholder="<?php esc_attr_e( 'Default message', 'afsv-vrc-core' ); ?>"><?php echo esc_textarea( isset( $v['ar_body'] ) ? $v['ar_body'] : '' ); ?></textarea></td></tr>
      </table>
    </details>
	<?php endforeach; ?>
    <p class="submit">
		<?php submit_button( __( 'Save settings', 'afsv-vrc-core' ), 'primary', 'save', false ); ?>
		<?php submit_button( __( 'Save and send a test email', 'afsv-vrc-core' ), 'secondary', 'send_test', false ); ?>
    </p>
  </form>
</div>
	<?php
}
