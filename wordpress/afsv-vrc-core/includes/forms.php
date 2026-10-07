<?php
/**
 * Form submissions from the AFSV Interest Form widget.
 *
 * Submissions are saved as private "Form submissions" in wp-admin and emailed
 * to the address set in Settings → General (or the widget's own recipient).
 * Spam protection: a hidden honeypot field and a per-IP rate limit.
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

function afsv_core_form_endpoint( $form_id ) {
	return rest_url( 'afsv/v1/forms/' . sanitize_key( $form_id ) );
}

function afsv_core_handle_form( WP_REST_Request $req ) {
	$params = $req->get_body_params();

	// Honeypot: real people never fill the hidden "website" field.
	if ( ! empty( $params['afsv_website'] ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}

	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
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
		if ( 0 === strpos( $k, 'afsv_' ) ) {
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
	'to'         => 'info@afsvhcl.com',
	'from_name'  => 'AFSV VRC',
	'from_email' => '',
	'ar_enabled' => 1,
	'ar_subject' => 'Thank you, {name} — we received your message',
	'ar_body'    => "Hi {name},\n\nThank you for getting in touch with AFSV VRC. We've received your submission (\"{form}\") and a member of our team will be in touch soon.\n\nFor your records, here is what you sent:\n\n{answers}\n\nWarm regards,\nThe AFSV VRC team\ninfo@afsvhcl.com",
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
        <td><input type="email" class="regular-text" id="afsv-from-email" name="from_email" value="<?php echo esc_attr( $s['from_email'] ); ?>" placeholder="<?php esc_attr_e( 'Leave empty to use the WordPress default', 'afsv-vrc-core' ); ?>"><p class="description"><?php esc_html_e( 'Use an address on your own domain (e.g. no-reply@afsvhcl.com) so emails are not marked as spam.', 'afsv-vrc-core' ); ?></p></td></tr>
      <tr><th scope="row"><?php esc_html_e( 'Auto-reply', 'afsv-vrc-core' ); ?></th>
        <td><label><input type="checkbox" name="ar_enabled" value="1" <?php checked( $s['ar_enabled'] ); ?>> <?php esc_html_e( 'Send an automatic reply to the person who filled in the form', 'afsv-vrc-core' ); ?></label></td></tr>
      <tr><th scope="row"><label for="afsv-ar-subject"><?php esc_html_e( 'Auto-reply subject', 'afsv-vrc-core' ); ?></label></th>
        <td><input type="text" class="large-text" id="afsv-ar-subject" name="ar_subject" value="<?php echo esc_attr( $s['ar_subject'] ); ?>"></td></tr>
      <tr><th scope="row"><label for="afsv-ar-body"><?php esc_html_e( 'Auto-reply message', 'afsv-vrc-core' ); ?></label></th>
        <td><textarea class="large-text" rows="9" id="afsv-ar-body" name="ar_body"><?php echo esc_textarea( $s['ar_body'] ); ?></textarea>
        <p class="description"><?php esc_html_e( 'Placeholders: {name}, {email}, {form} (form title), {site}, {answers} (everything they sent).', 'afsv-vrc-core' ); ?></p></td></tr>
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
