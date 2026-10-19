<?php
/**
 * Remote deploy endpoints, administrators only (WordPress REST, authenticated).
 *
 *   GET  /wp-json/afsv/v1/status   versions, page statuses and last build time
 *   POST /wp-json/afsv/v1/build    runs Tools → AFSV VRC Setup → Build
 *        body: { "status": "publish" | "draft", "front": true }
 *        Existing pages always keep their current status; "draft" only applies to new pages.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

function afsv_core_deploy_can() {
	return current_user_can( 'manage_options' );
}

add_action( 'rest_api_init', function () {
	register_rest_route(
		'afsv/v1',
		'/status',
		array(
			'methods'             => 'GET',
			'permission_callback' => 'afsv_core_deploy_can',
			'callback'            => 'afsv_core_deploy_status',
		)
	);
	register_rest_route(
		'afsv/v1',
		'/build',
		array(
			'methods'             => 'POST',
			'permission_callback' => 'afsv_core_deploy_can',
			'callback'            => 'afsv_core_deploy_build',
			'args'                => array(
				'status' => array( 'type' => 'string', 'enum' => array( 'publish', 'draft' ), 'default' => 'publish' ),
				'front'  => array( 'type' => 'boolean', 'default' => true ),
			),
		)
	);
} );

function afsv_core_deploy_status() {
	$theme = wp_get_theme();
	$pages = array();
	foreach ( glob( AFSV_CORE_DIR . 'content/page-*.json' ) as $file ) {
		$p    = json_decode( (string) file_get_contents( $file ), true );
		$slug = isset( $p['slug'] ) ? $p['slug'] : '';
		$post = $slug ? get_page_by_path( $slug, OBJECT, 'page' ) : null;
		$pages[ $slug ] = $post ? $post->post_status : 'missing';
	}
	$last = get_option( 'afsv_core_imported' );
	return rest_ensure_response(
		array(
			'plugin_version' => AFSV_CORE_VERSION,
			'theme'          => $theme->get_stylesheet(),
			'theme_version'  => $theme->get( 'Version' ),
			'last_build'     => $last ? wp_date( 'c', $last ) : null,
			'pages'          => $pages,
		)
	);
}

function afsv_core_deploy_build( WP_REST_Request $req ) {
	if ( function_exists( 'afsv_core_theme_ready' ) && ! afsv_core_theme_ready() ) {
		return new WP_Error( 'afsv_theme', 'Activate the AFSV VRC theme first.', array( 'status' => 409 ) );
	}
	$log = afsv_core_run_import(
		array(
			'status' => $req['status'],
			'front'  => (bool) $req['front'],
		)
	);
	return rest_ensure_response( array( 'ok' => true, 'log' => $log ) );
}
