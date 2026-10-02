<?php
/**
 * Content types: Events and Leaders, their fields, and the page header option.
 *
 * Every field is registered with show_in_rest so it can be filled from the
 * block editor, the REST API or an AI connector, and edited in a meta box.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

/** Field definitions per post type: key => [label, type, help, options]. */
function afsv_core_fields( $post_type ) {
	$fields = array(
		'afsv_event'  => array(
			'afsv_start'         => array( __( 'Start (date and time)', 'afsv-vrc-core' ), 'datetime-local', __( 'Drives the countdown and the order of events.', 'afsv-vrc-core' ) ),
			'afsv_timezone'      => array( __( 'UTC offset', 'afsv-vrc-core' ), 'text', __( 'For example -04:00 for Port of Spain.', 'afsv-vrc-core' ) ),
			'afsv_date_label'    => array( __( 'Date label', 'afsv-vrc-core' ), 'text', __( 'For example "April 29 – May 1, 2027".', 'afsv-vrc-core' ) ),
			'afsv_end_label'     => array( __( 'End label on the date tile', 'afsv-vrc-core' ), 'text', __( 'For example "– 1 May 2027".', 'afsv-vrc-core' ) ),
			'afsv_venue'         => array( __( 'Venue', 'afsv-vrc-core' ), 'text' ),
			'afsv_city'          => array( __( 'City and country', 'afsv-vrc-core' ), 'text' ),
			'afsv_url'           => array( __( 'Event website / registration URL', 'afsv-vrc-core' ), 'url' ),
			'afsv_brand'         => array( __( 'Visual brand', 'afsv-vrc-core' ), 'select', __( 'Partner events can use their own identity.', 'afsv-vrc-core' ), array( '' => 'AFSV VRC', 'gaisb' => 'GAISB (violet / peach)' ) ),
			'afsv_headline'      => array( __( 'Headline', 'afsv-vrc-core' ), 'text' ),
			'afsv_subhead'       => array( __( 'Sub-headline', 'afsv-vrc-core' ), 'text' ),
			'afsv_themes'        => array( __( 'Themes (one per line)', 'afsv-vrc-core' ), 'textarea' ),
			'afsv_facts'         => array( __( 'Key facts (one per line: value | label)', 'afsv-vrc-core' ), 'textarea' ),
			'afsv_cta_primary'   => array( __( 'Primary button label', 'afsv-vrc-core' ), 'text' ),
			'afsv_cta_secondary' => array( __( 'Secondary button label', 'afsv-vrc-core' ), 'text' ),
			'afsv_host'          => array( __( 'Host line', 'afsv-vrc-core' ), 'text' ),
		),
		'afsv_leader' => array(
			'afsv_role'     => array( __( 'Role', 'afsv-vrc-core' ), 'text' ),
			'afsv_short'    => array( __( 'Short summary (cards)', 'afsv-vrc-core' ), 'textarea' ),
			'afsv_quote'    => array( __( 'Quote', 'afsv-vrc-core' ), 'textarea' ),
			'afsv_quote_by' => array( __( 'Quote attribution', 'afsv-vrc-core' ), 'text' ),
			'afsv_focus'    => array( __( 'Focus areas (one per line: title | description)', 'afsv-vrc-core' ), 'textarea' ),
			'afsv_photo_alt' => array( __( 'Photo description (alt text)', 'afsv-vrc-core' ), 'text', __( 'Leave the featured image empty to show a monogram until an approved portrait is supplied.', 'afsv-vrc-core' ) ),
		),
	);
	return isset( $fields[ $post_type ] ) ? $fields[ $post_type ] : array();
}

function afsv_core_register_post_types() {
	register_post_type(
		'afsv_event',
		array(
			'labels'       => array(
				'name'          => __( 'Events', 'afsv-vrc-core' ),
				'singular_name' => __( 'Event', 'afsv-vrc-core' ),
				'add_new_item'  => __( 'Add event', 'afsv-vrc-core' ),
				'edit_item'     => __( 'Edit event', 'afsv-vrc-core' ),
				'all_items'     => __( 'All events', 'afsv-vrc-core' ),
			),
			'public'       => true,
			'has_archive'  => false,
			'rewrite'      => array( 'slug' => 'event' ),
			'menu_icon'    => 'dashicons-calendar-alt',
			'menu_position' => 21,
			'supports'     => array( 'title', 'excerpt', 'editor', 'thumbnail', 'custom-fields', 'revisions' ),
			'show_in_rest' => true,
			'rest_base'    => 'afsv-events',
		)
	);

	register_post_type(
		'afsv_leader',
		array(
			'labels'       => array(
				'name'          => __( 'Leadership', 'afsv-vrc-core' ),
				'singular_name' => __( 'Leader', 'afsv-vrc-core' ),
				'add_new_item'  => __( 'Add leader', 'afsv-vrc-core' ),
				'edit_item'     => __( 'Edit leader', 'afsv-vrc-core' ),
				'all_items'     => __( 'All leaders', 'afsv-vrc-core' ),
			),
			'public'       => false,
			'show_ui'      => true,
			'menu_icon'    => 'dashicons-groups',
			'menu_position' => 22,
			'supports'     => array( 'title', 'editor', 'thumbnail', 'page-attributes', 'custom-fields', 'revisions' ),
			'show_in_rest' => true,
			'rest_base'    => 'afsv-leaders',
		)
	);

	foreach ( array( 'afsv_event', 'afsv_leader' ) as $type ) {
		foreach ( afsv_core_fields( $type ) as $key => $def ) {
			register_post_meta(
				$type,
				$key,
				array(
					'type'              => 'string',
					'single'            => true,
					'show_in_rest'      => true,
					'sanitize_callback' => in_array( $def[1], array( 'textarea' ), true ) ? 'sanitize_textarea_field' : ( 'url' === $def[1] ? 'esc_url_raw' : 'sanitize_text_field' ),
					'auth_callback'     => function () {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}
	}

	// Per-page: float the header over the first section (hero pages).
	register_post_meta(
		'page',
		'afsv_header_overlay',
		array(
			'type'          => 'boolean',
			'single'        => true,
			'default'       => false,
			'show_in_rest'  => true,
			'auth_callback' => function () {
				return current_user_can( 'edit_pages' );
			},
		)
	);
}
add_action( 'init', 'afsv_core_register_post_types' );

/* ───────── Meta boxes ───────── */
add_action( 'add_meta_boxes', function () {
	foreach ( array( 'afsv_event' => __( 'Event details', 'afsv-vrc-core' ), 'afsv_leader' => __( 'Profile details', 'afsv-vrc-core' ) ) as $type => $title ) {
		add_meta_box( 'afsv-fields', $title, 'afsv_core_render_fields', $type, 'normal', 'high' );
	}
	add_meta_box( 'afsv-page', __( 'AFSV VRC header', 'afsv-vrc-core' ), 'afsv_core_render_page_box', 'page', 'side' );
} );

function afsv_core_render_fields( $post ) {
	wp_nonce_field( 'afsv_fields', 'afsv_fields_nonce' );
	echo '<table class="form-table" role="presentation"><tbody>';
	foreach ( afsv_core_fields( $post->post_type ) as $key => $def ) {
		$value = get_post_meta( $post->ID, $key, true );
		echo '<tr><th scope="row"><label for="' . esc_attr( $key ) . '">' . esc_html( $def[0] ) . '</label></th><td>';
		switch ( $def[1] ) {
			case 'textarea':
				echo '<textarea class="large-text" rows="4" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">' . esc_textarea( $value ) . '</textarea>';
				break;
			case 'select':
				echo '<select id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">';
				foreach ( $def[3] as $opt => $label ) {
					echo '<option value="' . esc_attr( $opt ) . '"' . selected( $value, $opt, false ) . '>' . esc_html( $label ) . '</option>';
				}
				echo '</select>';
				break;
			default:
				echo '<input class="regular-text" type="' . esc_attr( $def[1] ) . '" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( $value ) . '">';
		}
		if ( ! empty( $def[2] ) ) {
			echo '<p class="description">' . esc_html( $def[2] ) . '</p>';
		}
		echo '</td></tr>';
	}
	echo '</tbody></table>';
}

function afsv_core_render_page_box( $post ) {
	wp_nonce_field( 'afsv_fields', 'afsv_fields_nonce' );
	$on = (bool) get_post_meta( $post->ID, 'afsv_header_overlay', true );
	echo '<label><input type="checkbox" name="afsv_header_overlay" value="1"' . checked( $on, true, false ) . '> ' . esc_html__( 'Float the header over the first section', 'afsv-vrc-core' ) . '</label>';
	echo '<p class="description">' . esc_html__( 'Use on pages that start with a full-bleed hero.', 'afsv-vrc-core' ) . '</p>';
}

add_action( 'save_post', function ( $post_id, $post ) {
	if ( ! isset( $_POST['afsv_fields_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['afsv_fields_nonce'] ), 'afsv_fields' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	if ( 'page' === $post->post_type ) {
		update_post_meta( $post_id, 'afsv_header_overlay', ! empty( $_POST['afsv_header_overlay'] ) );
		return;
	}
	foreach ( afsv_core_fields( $post->post_type ) as $key => $def ) {
		if ( ! isset( $_POST[ $key ] ) ) {
			continue;
		}
		$raw   = wp_unslash( $_POST[ $key ] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$value = 'textarea' === $def[1] ? sanitize_textarea_field( $raw ) : ( 'url' === $def[1] ? esc_url_raw( $raw ) : sanitize_text_field( $raw ) );
		update_post_meta( $post_id, $key, $value );
	}
}, 10, 2 );

/** Split "a | b" lines into pairs; plain lines into a list. */
function afsv_core_lines( $text, $pairs = false ) {
	$out = array();
	foreach ( preg_split( '/\r\n|\r|\n/', (string) $text ) as $line ) {
		$line = trim( $line );
		if ( '' === $line ) {
			continue;
		}
		if ( $pairs ) {
			$bits  = array_map( 'trim', explode( '|', $line, 2 ) );
			$out[] = array( $bits[0], isset( $bits[1] ) ? $bits[1] : '' );
		} else {
			$out[] = $line;
		}
	}
	return $out;
}
