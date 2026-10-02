<?php
/**
 * Base class for AFSV VRC widgets: control shortcuts and design-system markup helpers.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Elementor\Widget_Base;

abstract class AFSV_Widget extends Widget_Base {

	public function get_categories() {
		return array( 'afsv-vrc' );
	}

	public function get_keywords() {
		return array( 'afsv', 'vrc' );
	}

	public function get_icon() {
		return 'eicon-star-o';
	}

	/* ───────── Control shortcuts ───────── */

	protected function text( $id, $label, $default = '', $type = 'text', $extra = array() ) {
		$types = array(
			'text'     => Controls_Manager::TEXT,
			'textarea' => Controls_Manager::TEXTAREA,
			'wysiwyg'  => Controls_Manager::WYSIWYG,
			'number'   => Controls_Manager::NUMBER,
		);
		$args = array(
			'label'   => $label,
			'type'    => $types[ $type ],
			'default' => $default,
			'dynamic' => array( 'active' => true ),
		);
		if ( 'text' === $type ) {
			$args['label_block'] = true;
		}
		$this->add_control( $id, array_merge( $args, $extra ) );
	}

	protected function url( $id, $label, $default = '' ) {
		$this->add_control(
			$id,
			array(
				'label'       => $label,
				'type'        => Controls_Manager::URL,
				'default'     => array( 'url' => $default ),
				'placeholder' => '/page-slug or https://…',
				'label_block' => true,
				'dynamic'     => array( 'active' => true ),
			)
		);
	}

	protected function media( $id, $label, $default_asset = '' ) {
		$this->add_control(
			$id,
			array(
				'label'   => $label,
				'type'    => Controls_Manager::MEDIA,
				'default' => array( 'url' => $default_asset ? afsv_asset( 'img/' . $default_asset ) : '' ),
				'dynamic' => array( 'active' => true ),
			)
		);
	}

	protected function toggle( $id, $label, $default = 'yes' ) {
		$this->add_control(
			$id,
			array(
				'label'        => $label,
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => $default,
			)
		);
	}

	protected function choose( $id, $label, $options, $default ) {
		$this->add_control(
			$id,
			array(
				'label'   => $label,
				'type'    => Controls_Manager::SELECT,
				'options' => $options,
				'default' => $default,
			)
		);
	}

	protected function video_url( $id = 'video', $label = '' ) {
		$this->add_control(
			$id,
			array(
				'label'       => $label ? $label : __( 'Background video URL (MP4, optional)', 'afsv-vrc-core' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'description' => __( 'Plays muted and looped when in view. The image is used as poster and as the reduced-motion fallback.', 'afsv-vrc-core' ),
			)
		);
	}

	protected function section( $id, $label ) {
		$this->start_controls_section( $id, array( 'label' => $label ) );
	}

	protected function repeater( $id, $label, $fields, $defaults, $title_field ) {
		$r = new Repeater();
		foreach ( $fields as $fid => $def ) {
			$args = array(
				'label'       => $def[0],
				'type'        => $def[1],
				'label_block' => true,
			);
			if ( Controls_Manager::MEDIA === $def[1] ) {
				$args['default'] = array( 'url' => '' );
			}
			if ( Controls_Manager::URL === $def[1] ) {
				$args['placeholder'] = '/page-slug or https://…';
			}
			$r->add_control( $fid, $args );
		}
		$this->add_control(
			$id,
			array(
				'label'       => $label,
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $r->get_controls(),
				'default'     => $defaults,
				'title_field' => $title_field,
			)
		);
	}

	/* ───────── Value helpers ───────── */

	protected function link_of( $value ) {
		if ( is_array( $value ) ) {
			return isset( $value['url'] ) ? (string) $value['url'] : '';
		}
		return (string) $value;
	}

	protected function img_of( $value ) {
		return is_array( $value ) && ! empty( $value['url'] ) ? $value['url'] : '';
	}

	protected function lines( $text ) {
		return afsv_core_lines( $text );
	}

	/* ───────── Markup helpers (mirror the static design build) ───────── */

	protected function btn( $label, $link, $variant = 'gold' ) {
		return afsv_btn( $label, $this->link_of( $link ), $variant );
	}

	/**
	 * Word-by-word headline cascade. Lines separated by newlines; words in $ink get the gold sweep.
	 */
	protected function split_words( $text, $ink = '' ) {
		$ink_words = array_filter( array_map( 'trim', explode( ',', (string) $ink ) ) );
		$i         = 0;
		$out       = array();
		foreach ( $this->lines( $text ) as $line ) {
			$words = array();
			foreach ( explode( ' ', $line ) as $word ) {
				$inner   = in_array( $word, $ink_words, true ) ? '<span class="ink">' . esc_html( $word ) . '</span>' : esc_html( $word );
				$words[] = '<span class="w"><span style="--i:' . ( $i++ ) . '">' . $inner . '</span></span>';
			}
			$out[] = implode( ' ', $words );
		}
		return implode( '<br>', $out );
	}

	protected function heading_text( $text ) {
		return implode( ' ', $this->lines( $text ) );
	}

	protected function pmedia( $img, $alt = '', $video = '', $parallax = 0.08, $eager = false ) {
		if ( ! $img ) {
			return '';
		}
		$attrs  = $video ? ' data-video="' . esc_url( $video ) . '"' : '';
		$attrs .= $parallax ? ' data-parallax="' . esc_attr( $parallax ) . '"' : '';
		$load   = $eager ? ' fetchpriority="high"' : ' loading="lazy"';
		return '<div class="pmedia' . ( $parallax ? '' : ' pmedia--still' ) . '"' . $attrs . '><img src="' . esc_url( $img ) . '" alt="' . esc_attr( $alt ) . '" width="1344" height="752"' . $load . '></div>';
	}

	protected function pad2( $n ) {
		return str_pad( (string) $n, 2, '0', STR_PAD_LEFT );
	}
}
