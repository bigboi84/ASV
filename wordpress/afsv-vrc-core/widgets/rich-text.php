<?php
/**
 * AFSV Text Section: heading plus rich text inside the design system's measure,
 * for policy pages, notes and long-form copy.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

class AFSV_Widget_Rich_Text extends AFSV_Widget {

	public function get_name() {
		return 'afsv-rich-text';
	}

	public function get_title() {
		return __( 'AFSV Text Section', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-text';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'eyebrow', __( 'Eyebrow (optional)', 'afsv-vrc-core' ), '' );
		$this->text( 'heading', __( 'Heading (optional)', 'afsv-vrc-core' ), '' );
		$this->text( 'body', __( 'Text', 'afsv-vrc-core' ), '<p>Write here.</p>', 'wysiwyg' );
		$this->choose(
			'style',
			__( 'Style', 'afsv-vrc-core' ),
			array(
				'plain'   => __( 'Plain', 'afsv-vrc-core' ),
				'note'    => __( 'Status note (proposed / planned notice)', 'afsv-vrc-core' ),
				'pending' => __( 'Pending inputs box', 'afsv-vrc-core' ),
			),
			'plain'
		);
		$this->choose( 'band', __( 'Background', 'afsv-vrc-core' ), array( 'white' => __( 'White', 'afsv-vrc-core' ), 'cream' => __( 'Cream', 'afsv-vrc-core' ) ), 'white' );
		$this->end_controls_section();
	}

	protected function render() {
		$s    = $this->get_settings_for_display();
		$body = wp_kses_post( $s['body'] );
		echo '<section class="' . ( 'cream' === $s['band'] ? 'band--cream' : '' ) . '"><div class="wrap section">';
		if ( 'note' === $s['style'] ) {
			echo '<div class="note" role="note">' . $body . '</div>'; // phpcs:ignore
		} elseif ( 'pending' === $s['style'] ) {
			echo '<div class="pending"><span class="eyebrow">' . esc_html( $s['eyebrow'] ? $s['eyebrow'] : __( 'Pending inputs', 'afsv-vrc-core' ) ) . '</span>' . $body . '</div>'; // phpcs:ignore
		} else {
			echo '<div class="measure reveal">';
			echo $s['eyebrow'] ? '<p class="eyebrow mb-s">' . esc_html( $s['eyebrow'] ) . '</p>' : '';
			echo $s['heading'] ? '<h2 class="h2 mb-m">' . esc_html( $s['heading'] ) . '</h2>' : '';
			echo '<div class="prose">' . $body . '</div></div>'; // phpcs:ignore
		}
		echo '</div></section>';
	}
}
