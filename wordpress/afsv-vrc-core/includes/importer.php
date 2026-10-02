<?php
/**
 * Tools → AFSV VRC Setup: creates the whole site from the bundled content/*.json —
 * every page as an Elementor layout, the header/footer templates, Events and Leadership.
 * Safe to run again: items are matched by slug and updated in place.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

add_action( 'admin_menu', function () {
	add_management_page( __( 'AFSV VRC Setup', 'afsv-vrc-core' ), __( 'AFSV VRC Setup', 'afsv-vrc-core' ), 'manage_options', 'afsv-setup', 'afsv_core_setup_screen' );
} );

/** Replace content placeholders with this site's URLs. */
function afsv_core_fill_placeholders( $json ) {
	$map = array(
		'img'   => function ( $v ) {
			return afsv_asset( 'img/' . $v );
		},
		'asset' => function ( $v ) {
			return afsv_asset( $v );
		},
		'url'   => function ( $v ) {
			return home_url( $v );
		},
		'form'  => function ( $v ) {
			return afsv_core_form_endpoint( $v );
		},
	);
	return preg_replace_callback(
		'/\{\{(img|asset|url|form):([^}]*)\}\}/',
		function ( $m ) use ( $map ) {
			// JSON-safe: escape quotes/backslashes that could appear in a URL.
			return addcslashes( $map[ $m[1] ]( $m[2] ), '"\\' );
		},
		$json
	);
}

function afsv_core_upsert( $type, $slug, $args ) {
	$found = get_posts(
		array(
			'post_type'      => $type,
			'name'           => $slug,
			'post_status'    => array( 'publish', 'draft', 'pending', 'private', 'future' ),
			'posts_per_page' => 1,
		)
	);
	$args = array_merge( array( 'post_type' => $type, 'post_name' => $slug ), $args );
	if ( $found ) {
		$args['ID'] = $found[0]->ID;
	}
	return wp_insert_post( wp_slash( $args ), true );
}

function afsv_core_set_elementor( $post_id, $elements, $type ) {
	$data = afsv_core_fill_placeholders( wp_json_encode( $elements, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) );
	update_post_meta( $post_id, '_elementor_edit_mode', 'builder' );
	update_post_meta( $post_id, '_elementor_template_type', $type );
	update_post_meta( $post_id, '_elementor_version', defined( 'ELEMENTOR_VERSION' ) ? ELEMENTOR_VERSION : '3.0.0' );
	update_post_meta( $post_id, '_elementor_data', wp_slash( $data ) );
	update_post_meta( $post_id, '_elementor_page_settings', array( 'hide_title' => 'yes' ) );
	delete_post_meta( $post_id, '_elementor_css' );
}

/**
 * Run the import. $opts: status (draft|publish), front (bool).
 *
 * @return string[] Log lines.
 */
function afsv_core_run_import( $opts ) {
	$dir    = AFSV_CORE_DIR . 'content/';
	$status = 'publish' === $opts['status'] ? 'publish' : 'draft';
	$log    = array();
	$read   = function ( $file ) {
		return json_decode( file_get_contents( $file ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	};

	foreach ( $read( $dir . 'events.json' ) as $e ) {
		$id = afsv_core_upsert( 'afsv_event', $e['slug'], array( 'post_title' => $e['title'], 'post_excerpt' => $e['excerpt'], 'post_status' => 'publish' ) );
		if ( ! is_wp_error( $id ) ) {
			foreach ( $e['meta'] as $k => $v ) {
				update_post_meta( $id, $k, $v );
			}
			$log[] = sprintf( 'Event: %s', $e['title'] );
		}
	}

	foreach ( $read( $dir . 'leaders.json' ) as $l ) {
		$id = afsv_core_upsert( 'afsv_leader', $l['slug'], array( 'post_title' => $l['title'], 'post_content' => $l['content'], 'menu_order' => (int) $l['order'], 'post_status' => 'publish' ) );
		if ( is_wp_error( $id ) ) {
			continue;
		}
		foreach ( $l['meta'] as $k => $v ) {
			update_post_meta( $id, $k, $v );
		}
		if ( ! empty( $l['photo'] ) && ! has_post_thumbnail( $id ) ) {
			$att = afsv_core_sideload_theme_image( $l['photo'], $id, $l['meta']['afsv_photo_alt'] );
			if ( $att ) {
				set_post_thumbnail( $id, $att );
			}
		}
		$log[] = sprintf( 'Leader: %s', $l['title'] );
	}

	foreach ( glob( $dir . 'template-*.json' ) as $file ) {
		$t  = $read( $file );
		$id = afsv_core_upsert( 'elementor_library', $t['slug'], array( 'post_title' => $t['title'], 'post_status' => 'publish' ) );
		if ( ! is_wp_error( $id ) ) {
			afsv_core_set_elementor( $id, $t['elements'], 'container' );
			wp_set_object_terms( $id, 'container', 'elementor_library_type' );
			$log[] = sprintf( 'Template: %s (published — it is used on every page)', $t['title'] );
		}
	}

	foreach ( glob( $dir . 'page-*.json' ) as $file ) {
		$p    = $read( $file );
		$args = array(
			'post_title'    => $p['title'],
			'post_status'   => $status,
			'page_template' => 'elementor_header_footer',
		);
		if ( ! empty( $p['description'] ) ) {
			$args['post_excerpt'] = $p['description'];
		}
		$id = afsv_core_upsert( 'page', $p['slug'], $args );
		if ( is_wp_error( $id ) ) {
			$log[] = sprintf( 'Page %s failed: %s', $p['slug'], $id->get_error_message() );
			continue;
		}
		afsv_core_set_elementor( $id, $p['elements'], 'wp-page' );
		update_post_meta( $id, 'afsv_header_overlay', ! empty( $p['overlay'] ) );
		if ( ! empty( $p['front'] ) && ! empty( $opts['front'] ) ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', $id );
		}
		$log[] = sprintf( 'Page: %s (%s)', $p['title'], $status );
	}

	if ( class_exists( '\Elementor\Plugin' ) ) {
		\Elementor\Plugin::instance()->files_manager->clear_cache();
	}
	flush_rewrite_rules();
	update_option( 'afsv_core_imported', time() );
	return $log;
}

/** Copy an image from the theme's assets into the Media Library. */
function afsv_core_sideload_theme_image( $file, $parent, $alt = '' ) {
	$src = get_stylesheet_directory() . '/assets/img/' . basename( $file );
	if ( ! file_exists( $src ) ) {
		return 0;
	}
	require_once ABSPATH . 'wp-admin/includes/image.php';
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	$tmp = wp_tempnam( basename( $file ) );
	copy( $src, $tmp );
	$id = media_handle_sideload( array( 'name' => basename( $file ), 'tmp_name' => $tmp ), $parent );
	if ( is_wp_error( $id ) ) {
		wp_delete_file( $tmp );
		return 0;
	}
	if ( $alt ) {
		update_post_meta( $id, '_wp_attachment_image_alt', $alt );
	}
	return $id;
}

function afsv_core_setup_screen() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$log = array();
	if ( isset( $_POST['afsv_import'] ) && check_admin_referer( 'afsv_import' ) ) {
		$log = afsv_core_run_import(
			array(
				'status' => isset( $_POST['afsv_status'] ) ? sanitize_key( $_POST['afsv_status'] ) : 'draft',
				'front'  => ! empty( $_POST['afsv_front'] ),
			)
		);
	}
	$pages = count( glob( AFSV_CORE_DIR . 'content/page-*.json' ) );
	$last  = get_option( 'afsv_core_imported' );
	?>
<div class="wrap">
	<h1><?php esc_html_e( 'AFSV VRC Setup', 'afsv-vrc-core' ); ?></h1>
	<p><?php echo esc_html( sprintf( /* translators: %d pages */ __( 'Creates the AFSV VRC website: %d pages built in Elementor, the site header and footer templates, Events and Leadership. Existing items with the same slug are updated, so you can run this again after a plugin update.', 'afsv-vrc-core' ), $pages ) ); ?></p>
	<?php if ( $last ) : ?><p><em><?php echo esc_html( sprintf( /* translators: date */ __( 'Last run: %s', 'afsv-vrc-core' ), wp_date( 'j M Y, H:i', $last ) ) ); ?></em></p><?php endif; ?>
	<?php if ( ! afsv_core_theme_ready() ) : ?>
	<div class="notice notice-error"><p><?php esc_html_e( 'Activate the AFSV VRC theme first.', 'afsv-vrc-core' ); ?></p></div>
	<?php else : ?>
	<form method="post">
		<?php wp_nonce_field( 'afsv_import' ); ?>
		<table class="form-table" role="presentation"><tbody>
			<tr><th scope="row"><?php esc_html_e( 'Pages', 'afsv-vrc-core' ); ?></th><td>
				<label><input type="radio" name="afsv_status" value="draft" checked> <?php esc_html_e( 'Create as drafts (review first)', 'afsv-vrc-core' ); ?></label><br>
				<label><input type="radio" name="afsv_status" value="publish"> <?php esc_html_e( 'Publish', 'afsv-vrc-core' ); ?></label>
				<p class="description"><?php esc_html_e( 'Pages that already exist keep their slug and are overwritten with the AFSV VRC layout.', 'afsv-vrc-core' ); ?></p>
			</td></tr>
			<tr><th scope="row"><?php esc_html_e( 'Homepage', 'afsv-vrc-core' ); ?></th><td>
				<label><input type="checkbox" name="afsv_front" value="1" checked> <?php esc_html_e( 'Use the AFSV VRC Home page as the front page', 'afsv-vrc-core' ); ?></label>
			</td></tr>
		</tbody></table>
		<?php submit_button( __( 'Build the AFSV VRC site', 'afsv-vrc-core' ), 'primary', 'afsv_import' ); ?>
	</form>
	<?php endif; ?>
	<?php if ( $log ) : ?>
	<h2><?php esc_html_e( 'Done', 'afsv-vrc-core' ); ?></h2>
	<ul style="list-style:disc;padding-left:20px"><?php foreach ( $log as $line ) : ?><li><?php echo esc_html( $line ); ?></li><?php endforeach; ?></ul>
	<p><a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>"><?php esc_html_e( 'View pages', 'afsv-vrc-core' ); ?></a></p>
	<?php endif; ?>
</div>
	<?php
}
