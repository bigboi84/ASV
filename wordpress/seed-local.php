<?php
/**
 * Local test seed: `wp eval-file wordpress/seed-local.php` in a test WordPress.
 * Writes wordpress/content/*.json into WordPress the same way the live push does,
 * using theme asset URLs for images.
 */

$dir   = dirname( __FILE__ ) . '/content/';
$asset = get_stylesheet_directory_uri() . '/assets/';

$fill = function ( $json ) use ( $asset ) {
	$json = preg_replace_callback( '/\{\{img:([^}]+)\}\}/', function ( $m ) use ( $asset ) {
		return $asset . 'img/' . $m[1];
	}, $json );
	return preg_replace_callback( '/\{\{asset:([^}]+)\}\}/', function ( $m ) use ( $asset ) {
		return $asset . $m[1];
	}, $json );
};

$upsert = function ( $type, $slug, $title, $extra = array() ) {
	$found = get_posts( array( 'post_type' => $type, 'name' => $slug, 'post_status' => 'any', 'posts_per_page' => 1 ) );
	$args  = array_merge( array( 'post_type' => $type, 'post_name' => $slug, 'post_title' => $title, 'post_status' => 'publish' ), $extra );
	if ( $found ) {
		$args['ID'] = $found[0]->ID;
	}
	return wp_insert_post( wp_slash( $args ) );
};

$set_elementor = function ( $id, $elements, $type ) use ( $fill ) {
	$data = $fill( wp_json_encode( $elements ) );
	update_post_meta( $id, '_elementor_edit_mode', 'builder' );
	update_post_meta( $id, '_elementor_template_type', $type );
	update_post_meta( $id, '_elementor_version', defined( 'ELEMENTOR_VERSION' ) ? ELEMENTOR_VERSION : '3.0.0' );
	update_post_meta( $id, '_elementor_data', wp_slash( $data ) );
	update_post_meta( $id, '_elementor_page_settings', array( 'hide_title' => 'yes' ) );
	delete_post_meta( $id, '_elementor_css' );
};

foreach ( glob( $dir . 'page-*.json' ) as $file ) {
	$p  = json_decode( file_get_contents( $file ), true );
	$id = $upsert( 'page', $p['slug'], $p['title'], array( 'page_template' => 'elementor_header_footer' ) );
	$set_elementor( $id, $p['elements'], 'wp-page' );
	update_post_meta( $id, 'afsv_header_overlay', $p['overlay'] ? '1' : '' );
	if ( ! empty( $p['front'] ) ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $id );
	}
	echo "page {$p['slug']} → $id\n";
}

foreach ( glob( $dir . 'template-*.json' ) as $file ) {
	$t  = json_decode( file_get_contents( $file ), true );
	$id = $upsert( 'elementor_library', $t['slug'], $t['title'] );
	$set_elementor( $id, $t['elements'], 'container' );
	wp_set_object_terms( $id, 'container', 'elementor_library_type' );
	echo "template {$t['slug']} → $id\n";
}

foreach ( json_decode( file_get_contents( $dir . 'events.json' ), true ) as $e ) {
	$id = $upsert( 'afsv_event', $e['slug'], $e['title'], array( 'post_excerpt' => $e['excerpt'] ) );
	foreach ( $e['meta'] as $k => $v ) {
		update_post_meta( $id, $k, $v );
	}
	echo "event {$e['slug']} → $id\n";
}

foreach ( json_decode( file_get_contents( $dir . 'leaders.json' ), true ) as $l ) {
	$id = $upsert( 'afsv_leader', $l['slug'], $l['title'], array( 'post_content' => $l['content'], 'menu_order' => $l['order'] ) );
	foreach ( $l['meta'] as $k => $v ) {
		update_post_meta( $id, $k, $v );
	}
	echo "leader {$l['slug']} → $id\n";
}

if ( class_exists( '\Elementor\Plugin' ) ) {
	\Elementor\Plugin::instance()->files_manager->clear_cache();
}
