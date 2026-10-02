<?php
/**
 * Elementor-built site header and footer.
 *
 * Create an Elementor template (Templates → Saved Templates, type "Section" or
 * "Container") with the slug "afsv-site-header" or "afsv-site-footer" and it
 * replaces the theme's default header/footer on every page. Put the
 * "AFSV Site Header" / "AFSV Site Footer" widget inside it, plus anything else.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

function afsv_core_part_template_id( $part ) {
	$slug  = 'afsv-site-' . $part;
	$posts = get_posts(
		array(
			'post_type'      => 'elementor_library',
			'name'           => $slug,
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'fields'         => 'ids',
		)
	);
	return (int) apply_filters( 'afsv_site_part_template', $posts ? $posts[0] : 0, $part );
}

function afsv_core_render_part( $part ) {
	$id = did_action( 'elementor/loaded' ) ? afsv_core_part_template_id( $part ) : 0;
	if ( $id && class_exists( '\Elementor\Plugin' ) ) {
		$html = \Elementor\Plugin::instance()->frontend->get_builder_content_for_display( $id, true );
		if ( $html ) {
			echo '<div class="afsv-part afsv-part--' . esc_attr( $part ) . '">' . $html . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput
			return;
		}
	}
	get_template_part( 'template-parts/site-' . $part );
}

add_action( 'afsv_site_header', function () {
	afsv_core_render_part( 'header' );
} );
add_action( 'afsv_site_footer', function () {
	afsv_core_render_part( 'footer' );
} );
