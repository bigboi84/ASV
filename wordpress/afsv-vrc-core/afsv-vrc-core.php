<?php
/**
 * Plugin Name:       AFSV VRC Core
 * Plugin URI:        https://afsvvrc.com
 * Description:       Features for the AFSV VRC website: Events and Leadership content types, Elementor-built site header and footer, and the AFSV VRC Elementor widget library. Requires the AFSV VRC theme and Elementor.
 * Version:           1.0.0
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            AFSV VRC Global Development Group Ltd.
 * License:           GPL-2.0-or-later
 * Text Domain:       afsv-vrc-core
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

define( 'AFSV_CORE_VERSION', '1.0.0' );
define( 'AFSV_CORE_FILE', __FILE__ );
define( 'AFSV_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'AFSV_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once AFSV_CORE_DIR . 'includes/post-types.php';
require_once AFSV_CORE_DIR . 'includes/events.php';
require_once AFSV_CORE_DIR . 'includes/leaders.php';
require_once AFSV_CORE_DIR . 'includes/site-parts.php';
require_once AFSV_CORE_DIR . 'includes/forms.php';
require_once AFSV_CORE_DIR . 'includes/elementor.php';

/** The widgets render the theme's design system, so the AFSV VRC theme must be active. */
function afsv_core_theme_ready() {
	return function_exists( 'afsv_btn' ) && function_exists( 'afsv_url' );
}

add_action( 'admin_notices', function () {
	if ( ! current_user_can( 'activate_plugins' ) ) {
		return;
	}
	if ( ! afsv_core_theme_ready() ) {
		echo '<div class="notice notice-warning"><p>' . esc_html__( 'AFSV VRC Core: activate the "AFSV VRC" theme (Appearance → Themes) so the widgets and site header can render.', 'afsv-vrc-core' ) . '</p></div>';
	}
	if ( ! did_action( 'elementor/loaded' ) ) {
		echo '<div class="notice notice-warning"><p>' . esc_html__( 'AFSV VRC Core: Elementor is required for the AFSV VRC widgets.', 'afsv-vrc-core' ) . '</p></div>';
	}
} );

register_activation_hook( __FILE__, function () {
	afsv_core_register_post_types();
	flush_rewrite_rules();
} );
register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
