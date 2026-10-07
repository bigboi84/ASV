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
	wp_insert_post(
		array(
			'post_type'    => 'afsv_submission',
			'post_status'  => 'private',
			'post_title'   => $title,
			'post_content' => $body,
		)
	);

	$to = get_option( 'afsv_form_recipient_' . $form );
	$to = is_email( $to ) ? $to : get_option( 'afsv_form_recipient', 'info@afsvhcl.com' );
	$to = is_email( $to ) ? $to : get_option( 'admin_email' );
	$headers = $email ? array( 'Reply-To: ' . $email ) : array();
	wp_mail( $to, '[AFSV VRC] ' . $title, $body . "\n\n" . home_url( '/' ), $headers );

	return new WP_REST_Response( array( 'ok' => true ), 200 );
}
