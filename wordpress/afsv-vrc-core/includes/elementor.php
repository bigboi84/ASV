<?php
/**
 * Elementor integration: widget category and the AFSV VRC widget library.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

/** Widget class files => class names. */
function afsv_core_widget_map() {
	return array(
		'site-header'     => 'AFSV_Widget_Site_Header',
		'site-footer'     => 'AFSV_Widget_Site_Footer',
		'hero'            => 'AFSV_Widget_Hero',
		'page-hero'       => 'AFSV_Widget_Page_Hero',
		'ticker'          => 'AFSV_Widget_Ticker',
		'section-head'    => 'AFSV_Widget_Section_Head',
		'event-feature'   => 'AFSV_Widget_Event_Feature',
		'panels'          => 'AFSV_Widget_Panels',
		'expand-feature'  => 'AFSV_Widget_Expand_Feature',
		'stats'           => 'AFSV_Widget_Stats',
		'path-cards'      => 'AFSV_Widget_Path_Cards',
		'esports'         => 'AFSV_Widget_Esports',
		'split-feature'   => 'AFSV_Widget_Split_Feature',
		'ai-band'         => 'AFSV_Widget_AI_Band',
		'interest-form'   => 'AFSV_Widget_Interest_Form',
		'cta-band'        => 'AFSV_Widget_CTA_Band',
		'leadership'      => 'AFSV_Widget_Leadership',
		'card-grid'       => 'AFSV_Widget_Card_Grid',
		'numbered-list'   => 'AFSV_Widget_Numbered_List',
		'rich-text'       => 'AFSV_Widget_Rich_Text',
	);
}

add_action( 'elementor/elements/categories_registered', function ( $manager ) {
	$manager->add_category(
		'afsv-vrc',
		array(
			'title' => __( 'AFSV VRC', 'afsv-vrc-core' ),
			'icon'  => 'eicon-star',
		)
	);
} );

add_action( 'elementor/widgets/register', function ( $widgets_manager ) {
	if ( ! afsv_core_theme_ready() ) {
		return;
	}
	require_once AFSV_CORE_DIR . 'widgets/class-afsv-widget.php';
	foreach ( afsv_core_widget_map() as $file => $class ) {
		require_once AFSV_CORE_DIR . 'widgets/' . $file . '.php';
		$widgets_manager->register( new $class() );
	}
} );

/* In the editor preview, show animated content immediately (no scroll reveal). */
add_action( 'wp_head', function () {
	if ( ! isset( $_GET['elementor-preview'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
		return;
	}
	echo '<style id="afsv-editor-reveal">.reveal,.wipe,[data-stagger]>*,.split-words .w>span{opacity:1!important;transform:none!important;clip-path:none!important}.wipe>*{clip-path:none!important}</style>';
}, 99 );
