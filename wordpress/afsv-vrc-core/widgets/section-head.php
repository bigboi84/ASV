<?php
/**
 * AFSV Section Heading: eyebrow, heading and intro, with an optional text link.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

class AFSV_Widget_Section_Head extends AFSV_Widget {

	public function get_name() {
		return 'afsv-section-head';
	}

	public function get_title() {
		return __( 'AFSV Section Heading', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-heading';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'eyebrow', __( 'Eyebrow (optional)', 'afsv-vrc-core' ), '' );
		$this->text( 'heading', __( 'Heading', 'afsv-vrc-core' ), 'Section heading.' );
		$this->choose( 'tag', __( 'Heading level', 'afsv-vrc-core' ), array( 'h1' => 'H1', 'h2' => 'H2', 'h3' => 'H3' ), 'h2' );
		$this->text( 'text', __( 'Intro', 'afsv-vrc-core' ), '', 'textarea' );
		$this->text( 'link_label', __( 'Link label (optional)', 'afsv-vrc-core' ), '' );
		$this->url( 'link', __( 'Link', 'afsv-vrc-core' ) );
		$this->choose(
			'band',
			__( 'Background', 'afsv-vrc-core' ),
			array(
				'none'  => __( 'Inside a section (no wrapper)', 'afsv-vrc-core' ),
				'white' => __( 'White section', 'afsv-vrc-core' ),
				'cream' => __( 'Cream section', 'afsv-vrc-core' ),
				'navy'  => __( 'Navy section', 'afsv-vrc-core' ),
			),
			'white'
		);
		$this->end_controls_section();
	}

	protected function render() {
		$s    = $this->get_settings_for_display();
		$tag  = in_array( $s['tag'], array( 'h1', 'h2', 'h3' ), true ) ? $s['tag'] : 'h2';
		$cls  = 'h1' === $tag ? 'h1' : 'h2';
		$link = $s['link_label'] ? ' <a class="text-link" href="' . esc_url( afsv_url( $this->link_of( $s['link'] ) ) ) . '">' . esc_html( $s['link_label'] ) . ' ' . afsv_arrow() . '</a>' : '';
		$head = '<div class="section-head reveal">';
		$head .= $s['eyebrow'] ? '<p class="eyebrow">' . esc_html( $s['eyebrow'] ) . '</p>' : '';
		$head .= '<' . $tag . ' class="' . $cls . '">' . esc_html( $s['heading'] ) . '</' . $tag . '>';
		$head .= ( $s['text'] || $link ) ? '<p class="body-lg' . ( 'navy' === $s['band'] ? '' : ' muted' ) . '">' . esc_html( $s['text'] ) . $link . '</p>' : '';
		$head .= '</div>';
		if ( 'none' === $s['band'] ) {
			echo $head; // phpcs:ignore
			return;
		}
		$band = array( 'white' => '', 'cream' => 'band--cream', 'navy' => 'band--navy' );
		echo '<section class="' . esc_attr( $band[ $s['band'] ] ) . '"><div class="wrap section" style="padding-bottom:0">' . $head . '</div></section>'; // phpcs:ignore
	}
}
