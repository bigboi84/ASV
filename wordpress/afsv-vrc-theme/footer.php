<?php
/**
 * Footer. Uses an Elementor "Site Footer" template from AFSV VRC Core when present.
 *
 * @package AFSV_VRC
 */

defined( 'ABSPATH' ) || exit;
?>
</main>
<?php
if ( has_action( 'afsv_site_footer' ) ) {
	do_action( 'afsv_site_footer' );
} else {
	get_template_part( 'template-parts/site-footer' );
}
wp_footer();
?>
</body>
</html>
