<?php
/**
 * Design-system helpers shared by the theme templates and the AFSV VRC Core widgets.
 *
 * @package AFSV_VRC
 */

defined( 'ABSPATH' ) || exit;

/** True when the current singular post is built with Elementor. */
function afsv_is_elementor_page( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_queried_object_id();
	return $post_id && 'builder' === get_post_meta( $post_id, '_elementor_edit_mode', true );
}

/**
 * Whether the header floats over the first section (home and hero pages).
 * Set per page with the "afsv_header_overlay" field (AFSV VRC Core adds it to the page editor).
 */
function afsv_header_overlay() {
	$overlay = false;
	if ( is_front_page() || is_singular() ) {
		$id      = get_queried_object_id();
		$overlay = $id && (bool) get_post_meta( $id, 'afsv_header_overlay', true );
	}
	return (bool) apply_filters( 'afsv_header_overlay', $overlay );
}

/**
 * Resolve a design route ("/about", "/about#team", "https://…", "#id") to a URL.
 */
function afsv_url( $route ) {
	if ( ! $route || '/' === $route ) {
		return home_url( '/' );
	}
	if ( preg_match( '#^(https?:|mailto:|tel:|\#)#', $route ) ) {
		return $route;
	}
	$parts = explode( '#', $route, 2 );
	$path  = trim( $parts[0], '/' );
	$url   = home_url( '/' . ( $path ? $path . '/' : '' ) );
	return isset( $parts[1] ) ? $url . '#' . $parts[1] : $url;
}

function afsv_is_external( $url ) {
	if ( ! preg_match( '#^https?://#', (string) $url ) ) {
		return false;
	}
	$host = wp_parse_url( home_url(), PHP_URL_HOST );
	return wp_parse_url( $url, PHP_URL_HOST ) !== $host;
}

/** Inline SVG icons (decorative). */
function afsv_icon( $name, $class = '' ) {
	$paths = array(
		'arrow'    => '<path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/>',
		'external' => '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/>',
		'pause'    => '<path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor"/>',
		'play'     => '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
		'up'       => '<path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/>',
	);
	if ( ! isset( $paths[ $name ] ) ) {
		return '';
	}
	return '<svg class="icon ' . esc_attr( $class ) . '" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' . $paths[ $name ] . '</svg>';
}

function afsv_arrow() {
	return '<span class="arrow" aria-hidden="true">' . afsv_icon( 'arrow' ) . '</span>';
}

/**
 * Button markup. $url may be a design route or a full URL.
 * Variants: gold, navy, line-light, line-dark.
 */
function afsv_btn( $label, $url, $variant = 'gold', $extra_attrs = '' ) {
	if ( '' === trim( (string) $label ) ) {
		return '';
	}
	$href = afsv_url( $url );
	$ext  = afsv_is_external( $href );
	$out  = '<a class="btn btn--' . esc_attr( $variant ) . '" href="' . esc_url( $href ) . '"';
	$out .= $ext ? ' target="_blank" rel="noopener noreferrer"' : '';
	$out .= $extra_attrs ? ' ' . $extra_attrs : '';
	$out .= '>' . esc_html( $label );
	$out .= $ext ? '<span class="sr-only"> ' . esc_html__( '(opens in a new tab)', 'afsv-vrc' ) . '</span>' . afsv_icon( 'external' ) : afsv_arrow();
	return $out . '</a>';
}

/**
 * Navigation tree for a menu location (or menu ID/slug), falling back to the design defaults.
 * Returns [ [label, href, kids => [...]] ].
 */
function afsv_nav_tree( $location = 'afsv-primary', $menu = 0 ) {
	if ( ! $menu ) {
		$locations = get_nav_menu_locations();
		$menu      = isset( $locations[ $location ] ) ? $locations[ $location ] : 0;
	}
	$items = $menu ? wp_get_nav_menu_items( $menu ) : array();
	if ( ! $items ) {
		return 'afsv-primary' === $location ? afsv_default_nav() : array();
	}
	$by_parent = array();
	foreach ( $items as $item ) {
		$by_parent[ (int) $item->menu_item_parent ][] = $item;
	}
	$build = function ( $parent ) use ( &$build, $by_parent ) {
		$out = array();
		foreach ( isset( $by_parent[ $parent ] ) ? $by_parent[ $parent ] : array() as $item ) {
			$node = array(
				'label' => $item->title,
				'href'  => $item->url,
			);
			$kids = $build( (int) $item->ID );
			if ( $kids ) {
				$node['kids'] = $kids;
			}
			$out[] = $node;
		}
		return $out;
	};
	return $build( 0 );
}

/** Whether a nav link points at the current page. */
function afsv_is_current( $href ) {
	$current = trailingslashit( strtok( home_url( add_query_arg( array() ) ), '?#' ) );
	return trailingslashit( strtok( afsv_url( $href ), '?#' ) ) === $current;
}

/** Footer columns: assigned menus first, otherwise the design defaults. */
function afsv_footer_columns() {
	$cols      = array();
	$locations = get_nav_menu_locations();
	for ( $i = 1; $i <= 4; $i++ ) {
		$loc = 'afsv-footer-' . $i;
		if ( empty( $locations[ $loc ] ) ) {
			continue;
		}
		$menu  = wp_get_nav_menu_object( $locations[ $loc ] );
		$links = array();
		foreach ( (array) wp_get_nav_menu_items( $locations[ $loc ] ) as $item ) {
			$links[] = array(
				'label' => $item->title,
				'href'  => $item->url,
			);
		}
		if ( $menu && $links ) {
			$cols[] = array(
				'title' => $menu->name,
				'links' => $links,
			);
		}
	}
	if ( ! $cols ) {
		$cols = afsv_default_footer_columns();
	}
	return apply_filters( 'afsv_footer_columns', $cols );
}

/** Logo URLs: Customizer logo for the dark version, theme assets otherwise. */
function afsv_logo( $variant = 'dark' ) {
	if ( 'dark' === $variant && has_custom_logo() ) {
		$src = wp_get_attachment_image_url( get_theme_mod( 'custom_logo' ), 'full' );
		if ( $src ) {
			return $src;
		}
	}
	$file = 'dark' === $variant ? 'logo.png' : 'logo-reverse.png';
	return get_stylesheet_directory_uri() . '/assets/img/' . $file;
}

function afsv_asset( $path ) {
	return get_stylesheet_directory_uri() . '/assets/' . ltrim( $path, '/' );
}

/**
 * Site chrome variant for the current request: "overlay" (header floats over the hero),
 * "market" (Marketplace header, no floating menu) or "default". Set per page by the importer
 * in the "afsv_chrome" field; WooCommerce pages use the Marketplace chrome.
 */
function afsv_chrome_variant() {
	$v = '';
	if ( is_singular() ) {
		$v = (string) get_post_meta( get_queried_object_id(), 'afsv_chrome', true );
	}
	if ( ! $v && function_exists( 'is_woocommerce' ) && ( is_woocommerce() || is_cart() || is_checkout() || is_account_page() ) ) {
		$v = 'market';
	}
	if ( ! $v ) {
		$v = afsv_header_overlay() ? 'overlay' : 'default';
	}
	return in_array( $v, array( 'overlay', 'market', 'default' ), true ) ? $v : 'default';
}

/** Resolve {{asset:…}} and {{url:…}} placeholders in design markup. */
function afsv_fill( $html ) {
	return preg_replace_callback(
		'/\{\{(asset|url):([^}]*)\}\}/',
		function ( $m ) {
			return esc_url( 'asset' === $m[1] ? afsv_asset( $m[2] ) : home_url( $m[2] ) );
		},
		$html
	);
}

/** Print the "top" or "bottom" site chrome, marking the current page's links. */
function afsv_chrome( $part ) {
	$file = get_stylesheet_directory() . '/chrome/' . afsv_chrome_variant() . '-' . $part . '.html';
	if ( ! file_exists( $file ) ) {
		get_template_part( 'top' === $part ? 'template-parts/site-header' : 'template-parts/site-footer' );
		return;
	}
	$html = afsv_fill( file_get_contents( $file ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	if ( is_singular() || is_front_page() ) {
		$here = esc_url( trailingslashit( get_permalink( get_queried_object_id() ) ) );
		$html = str_replace( 'href="' . $here . '"', 'href="' . $here . '" aria-current="page"', $html );
	}
	echo $html; // phpcs:ignore WordPress.Security.EscapeOutput -- generated design markup.
}
