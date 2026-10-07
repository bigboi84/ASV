<?php
/**
 * AFSV VRC child theme.
 *
 * The theme owns the design: tokens, fonts, header, footer and motion.
 * Features (Elementor widgets, Events, Leadership) live in the AFSV VRC Core plugin.
 *
 * @package AFSV_VRC
 */

defined( 'ABSPATH' ) || exit;

define( 'AFSV_THEME_VERSION', '1.2.0' );
define( 'AFSV_BOOKING_URL', 'https://book.afsvvrc.com' );

require_once get_stylesheet_directory() . '/inc/defaults.php';
require_once get_stylesheet_directory() . '/inc/helpers.php';
if ( class_exists( 'WooCommerce' ) || defined( 'WC_VERSION' ) ) {
	require_once get_stylesheet_directory() . '/inc/shop.php';
}

/* ───────── Setup ───────── */
add_action( 'after_setup_theme', function () {
	load_child_theme_textdomain( 'afsv-vrc', get_stylesheet_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support( 'woocommerce' );

	register_nav_menus(
		array(
			'afsv-primary'  => __( 'Primary navigation (header + mobile drawer)', 'afsv-vrc' ),
			'afsv-footer-1' => __( 'Footer column 1', 'afsv-vrc' ),
			'afsv-footer-2' => __( 'Footer column 2', 'afsv-vrc' ),
			'afsv-footer-3' => __( 'Footer column 3', 'afsv-vrc' ),
			'afsv-footer-4' => __( 'Footer column 4', 'afsv-vrc' ),
			'afsv-legal'    => __( 'Footer legal bar', 'afsv-vrc' ),
		)
	);
}, 20 );

/* Hello Elementor: we print our own header and footer, so switch its version off. */
add_filter( 'hello_elementor_header_footer', '__return_false' );
add_filter( 'hello_elementor_page_title', function ( $show ) {
	// Elementor-built pages carry their own hero.
	return ( is_singular() && afsv_is_elementor_page() ) ? false : $show;
} );

/* ───────── Assets ───────── */
add_action( 'wp_enqueue_scripts', function () {
	$uri = get_stylesheet_directory_uri() . '/assets';
	$ver = AFSV_THEME_VERSION;

	// Hello's reset and header/footer CSS fight the design system.
	foreach ( array( 'hello-elementor', 'hello-elementor-theme-style', 'hello-elementor-header-footer' ) as $handle ) {
		wp_dequeue_style( $handle );
	}

	// Load after Elementor's frontend CSS so the design system wins ties
	// (e.g. Elementor's ".elementor img { height: auto }").
	$deps = wp_style_is( 'elementor-frontend', 'registered' ) ? array( 'elementor-frontend' ) : array();
	wp_enqueue_style( 'afsv-site', $uri . '/css/site.css', $deps, $ver );
	wp_enqueue_style( 'afsv-bridge', get_stylesheet_uri(), array( 'afsv-site' ), $ver );

	wp_enqueue_script( 'afsv-site', $uri . '/js/site.js', array(), $ver, array( 'strategy' => 'defer', 'in_footer' => true ) );
	wp_enqueue_script( 'afsv-motion', $uri . '/js/motion.js', array( 'afsv-site' ), $ver, array( 'strategy' => 'defer', 'in_footer' => true ) );
	wp_enqueue_script( 'afsv-flow', $uri . '/js/flow.js', array( 'afsv-site' ), $ver, array( 'strategy' => 'defer', 'in_footer' => true ) );
	if ( is_front_page() ) {
		wp_enqueue_script( 'afsv-intro', $uri . '/js/intro.js', array( 'afsv-site' ), $ver, array( 'strategy' => 'defer', 'in_footer' => true ) );
	}
	// Forms post to the AFSV VRC Core inbox (REST: afsv/v1/forms/<form>).
	wp_add_inline_script( 'afsv-site', 'window.AFSV_FORMS = ' . wp_json_encode( esc_url_raw( rest_url( 'afsv/v1/forms/' ) ) ) . ';', 'before' );
}, 20 );

/* Self-hosted fonts: preload the two used above the fold. */
add_action( 'wp_head', function () {
	$uri = get_stylesheet_directory_uri() . '/assets/fonts/';
	printf( '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n", esc_url( $uri . 'montserrat-latin.woff2' ) );
	printf( '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n", esc_url( $uri . 'inter-latin.woff2' ) );
	echo '<meta name="theme-color" content="#091E36">' . "\n";
}, 2 );

/* Favicon fallback until a Site Icon is set in the Customizer. */
add_action( 'wp_head', function () {
	if ( ! has_site_icon() ) {
		printf( '<link rel="icon" href="%s" type="image/svg+xml">' . "\n", esc_url( get_stylesheet_directory_uri() . '/assets/img/favicon.svg' ) );
	}
}, 3 );

/* Elementor: use the design system's fonts and colours as the defaults
   and keep its own Google Fonts off (fonts are self-hosted). */
add_filter( 'elementor/frontend/print_google_fonts', '__return_false' );

/* Body classes the design system uses. */
add_filter( 'body_class', function ( $classes ) {
	if ( afsv_header_overlay() ) {
		$classes[] = 'has-overlay-header';
	}
	if ( 'market' === afsv_chrome_variant() ) {
		$classes[] = 'is-market';
	}
	return $classes;
} );
