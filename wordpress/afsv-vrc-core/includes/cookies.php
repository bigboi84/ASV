<?php
/**
 * Cookie notice and preferences.
 *
 * The site sets only the cookies it needs to work. The notice says so, remembers the visitor's choice in
 * one first-party cookie (afsv_cookies) and gives future optional tools (analytics, marketing) a gate:
 * a script written as <script type="text/plain" data-afsv-consent="analytics" src="…"> only runs once the
 * visitor has allowed optional cookies; PHP can ask afsv_cookies_allowed().
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

const AFSV_COOKIE_NAME = 'afsv_cookies';

/** Has this visitor allowed optional cookies? Essential cookies never depend on this. */
function afsv_cookies_allowed( $category = 'optional' ) {
	if ( empty( $_COOKIE[ AFSV_COOKIE_NAME ] ) ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		return false;
	}
	$c = json_decode( wp_unslash( $_COOKIE[ AFSV_COOKIE_NAME ] ), true ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
	return is_array( $c ) && ! empty( $c['optional'] );
}

function afsv_cookies_enabled() {
	return (bool) apply_filters( 'afsv_cookie_notice_enabled', true );
}

add_action( 'wp_enqueue_scripts', function () {
	if ( ! afsv_cookies_enabled() ) {
		return;
	}
	wp_enqueue_style( 'afsv-cookies', AFSV_CORE_URL . 'assets/cookies.css', array(), AFSV_CORE_VERSION );
	wp_enqueue_script( 'afsv-cookies', AFSV_CORE_URL . 'assets/cookies.js', array(), AFSV_CORE_VERSION, array( 'strategy' => 'defer', 'in_footer' => true ) );
	wp_add_inline_script( 'afsv-cookies', 'window.AFSV_COOKIES = ' . wp_json_encode( array( 'privacy' => home_url( '/privacy/' ), 'name' => AFSV_COOKIE_NAME ) ) . ';', 'before' );
}, 40 );
