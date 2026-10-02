<?php
/**
 * Leaders: queries, view model and portrait markup.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

/** @return WP_Post[] Leaders in menu order. */
function afsv_core_get_leaders() {
	return get_posts(
		array(
			'post_type'      => 'afsv_leader',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => array( 'menu_order' => 'ASC', 'ID' => 'ASC' ),
		)
	);
}

function afsv_core_leader_view( $post ) {
	$post = get_post( $post );
	$m    = function ( $k ) use ( $post ) {
		return (string) get_post_meta( $post->ID, $k, true );
	};
	$paras = array();
	foreach ( preg_split( '/\n\s*\n/', wp_strip_all_tags( $post->post_content ) ) as $p ) {
		$p = trim( $p );
		if ( '' !== $p ) {
			$paras[] = $p;
		}
	}
	$focus = array();
	foreach ( afsv_core_lines( $m( 'afsv_focus' ), true ) as $f ) {
		$focus[] = array( 't' => $f[0], 'd' => $f[1] );
	}
	return array(
		'id'       => $post->ID,
		'slug'     => $post->post_name,
		'name'     => get_the_title( $post ),
		'role'     => $m( 'afsv_role' ),
		'short'    => $m( 'afsv_short' ),
		'quote'    => $m( 'afsv_quote' ),
		'quote_by' => $m( 'afsv_quote_by' ),
		'focus'    => $focus,
		'bio'      => $paras,
		'img'      => get_the_post_thumbnail_url( $post, 'large' ),
		'alt'      => $m( 'afsv_photo_alt' ),
	);
}

function afsv_core_initials( $name ) {
	$out = '';
	foreach ( preg_split( '/[\s-]+/', $name ) as $w ) {
		if ( '' !== $w && strlen( $out ) < 2 ) {
			$out .= strtoupper( substr( $w, 0, 1 ) );
		}
	}
	return $out;
}

/** Portrait, or a designed monogram until an approved portrait is supplied. */
function afsv_core_portrait( $p, $class = '' ) {
	if ( $p['img'] ) {
		$alt = $p['alt'] ? $p['alt'] : sprintf( /* translators: person name */ __( 'Portrait of %s', 'afsv-vrc-core' ), $p['name'] );
		return '<div class="portrait ' . esc_attr( $class ) . '"><img src="' . esc_url( $p['img'] ) . '" alt="' . esc_attr( $alt ) . '" width="940" height="1224" loading="lazy"></div>';
	}
	return '<div class="portrait portrait--mono ' . esc_attr( $class ) . '" role="img" aria-label="' . esc_attr( sprintf( /* translators: person name */ __( '%s — approved portrait pending', 'afsv-vrc-core' ), $p['name'] ) ) . '"><span class="portrait__initials" aria-hidden="true">' . esc_html( afsv_core_initials( $p['name'] ) ) . '</span><span class="portrait__note">' . esc_html__( 'Portrait coming soon', 'afsv-vrc-core' ) . '</span></div>';
}
