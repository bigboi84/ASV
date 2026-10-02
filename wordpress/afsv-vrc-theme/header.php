<?php
/**
 * Header. The masthead comes from an Elementor "Site Header" template when
 * AFSV VRC Core provides one (hook: afsv_site_header), otherwise from the theme part.
 *
 * @package AFSV_VRC
 */

defined( 'ABSPATH' ) || exit;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to main content', 'afsv-vrc' ); ?></a>
<?php
if ( has_action( 'afsv_site_header' ) ) {
	do_action( 'afsv_site_header' );
} else {
	get_template_part( 'template-parts/site-header' );
}
?>
<main id="main" tabindex="-1">
