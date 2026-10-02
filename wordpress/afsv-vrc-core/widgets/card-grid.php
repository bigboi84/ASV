<?php
/**
 * AFSV Card Grid: general-purpose cards (image optional) for programs, facilities, partners and news.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class AFSV_Widget_Card_Grid extends AFSV_Widget {

	public function get_name() {
		return 'afsv-card-grid';
	}

	public function get_title() {
		return __( 'AFSV Card Grid', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-gallery-grid';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'heading', __( 'Heading (optional)', 'afsv-vrc-core' ), '' );
		$this->text( 'text', __( 'Intro', 'afsv-vrc-core' ), '', 'textarea' );
		$this->repeater(
			'cards',
			__( 'Cards', 'afsv-vrc-core' ),
			array(
				'image'  => array( __( 'Image (optional)', 'afsv-vrc-core' ), Controls_Manager::MEDIA ),
				'kicker' => array( __( 'Kicker', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'title'  => array( __( 'Title', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'desc'   => array( __( 'Description', 'afsv-vrc-core' ), Controls_Manager::TEXTAREA ),
				'pill'   => array( __( 'Pill (optional)', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'link'   => array( __( 'Link (optional)', 'afsv-vrc-core' ), Controls_Manager::URL ),
			),
			array(
				array( 'kicker' => 'Pathway', 'title' => 'Card title', 'desc' => 'Short description.', 'pill' => '', 'link' => array( 'url' => '' ) ),
			),
			'{{{ title }}}'
		);
		$this->choose( 'band', __( 'Background', 'afsv-vrc-core' ), array( 'white' => __( 'White', 'afsv-vrc-core' ), 'cream' => __( 'Cream', 'afsv-vrc-core' ) ), 'white' );
		$this->choose( 'min', __( 'Minimum card width', 'afsv-vrc-core' ), array( '240' => '240px', '300' => '300px', '360' => '360px' ), '300' );
		$this->end_controls_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		echo '<section class="' . ( 'cream' === $s['band'] ? 'band--cream' : '' ) . '"><div class="wrap section">';
		if ( $s['heading'] ) {
			echo '<div class="section-head reveal"><h2 class="h2">' . esc_html( $s['heading'] ) . '</h2>' . ( $s['text'] ? '<p class="body-lg muted">' . esc_html( $s['text'] ) . '</p>' : '' ) . '</div>';
		}
		echo '<div class="cards" style="--min:' . (int) $s['min'] . 'px" data-stagger>';
		foreach ( $s['cards'] as $c ) {
			$href = $this->link_of( $c['link'] );
			$tag  = $href ? 'a' : 'div';
			$attr = $href ? ' href="' . esc_url( afsv_url( $href ) ) . '"' : '';
			$img  = $this->img_of( $c['image'] );
			echo '<' . $tag . ' class="card-link' . ( $href ? '' : ' card-link--static' ) . ( $img ? ' card-link--img' : '' ) . '"' . $attr . '>'; // phpcs:ignore
			echo $img ? '<span class="card-link__img"><img src="' . esc_url( $img ) . '" alt="" width="1344" height="752" loading="lazy"></span>' : '';
			echo $c['kicker'] ? '<span class="eyebrow">' . esc_html( $c['kicker'] ) . '</span>' : '';
			echo '<h3>' . esc_html( $c['title'] ) . '</h3>';
			echo $c['desc'] ? '<p>' . esc_html( $c['desc'] ) . '</p>' : '';
			echo $c['pill'] ? '<span class="pill">' . esc_html( $c['pill'] ) . '</span>' : '';
			echo $href ? afsv_arrow() : ''; // phpcs:ignore
			echo '</' . $tag . '>'; // phpcs:ignore
		}
		echo '</div></div></section>';
	}
}
