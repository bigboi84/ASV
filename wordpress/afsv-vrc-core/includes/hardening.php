<?php
/**
 * Site hardening: no public list of usernames, registration stays locked, generic login errors.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

/** Public sign-up is off (WordPress and WooCommerce) until the team decides otherwise. */
add_filter( 'option_users_can_register', '__return_zero' );
add_filter( 'option_woocommerce_enable_myaccount_registration', function () {
	return 'no';
} );
add_filter( 'option_woocommerce_enable_signup_and_login_from_checkout', function () {
	return 'no';
} );

/** The users list in the REST API is for signed-in people who may list users, not the public. */
add_filter( 'rest_endpoints', function ( $endpoints ) {
	if ( current_user_can( 'list_users' ) ) {
		return $endpoints;
	}
	foreach ( array( '/wp/v2/users', '/wp/v2/users/(?P<id>[\d]+)' ) as $route ) {
		unset( $endpoints[ $route ] );
	}
	return $endpoints;
} );

/** ?author=1 and /author/name/ would show a username: send visitors home instead. */
add_action( 'init', function () {
	if ( is_admin() || is_user_logged_in() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}
	if ( isset( $_GET['author'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}, 1 );
add_action( 'template_redirect', function () {
	if ( is_author() && ! is_user_logged_in() ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}, 0 );

/** Keep usernames out of the sitemap and out of oEmbed data. */
add_filter( 'wp_sitemaps_add_provider', function ( $provider, $name ) {
	return 'users' === $name ? false : $provider;
}, 10, 2 );
add_filter( 'oembed_response_data', function ( $data ) {
	unset( $data['author_name'], $data['author_url'] );
	return $data;
} );

/** The login form should not say whether the username or the password was wrong. */
add_filter( 'login_errors', function () {
	return esc_html__( 'The username or password is incorrect.', 'afsv-vrc-core' );
} );

/** XML-RPC is not used by this site (the WordPress connector uses the REST API). */
add_filter( 'xmlrpc_enabled', '__return_false' );
