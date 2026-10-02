<?php
/**
 * AFSV Numbered List: hairline cells or rows with 01, 02… numbering.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

class AFSV_Widget_Numbered_List extends AFSV_Widget {

	public function get_name() {
		return 'afsv-numbered-list';
	}

	public function get_title() {
		return __( 'AFSV Numbered List', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-bullet-list';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'heading', __( 'Heading (optional)', 'afsv-vrc-core' ), '' );
		$this->text( 'text', __( 'Intro', 'afsv-vrc-core' ), '', 'textarea' );
		$this->text( 'items', __( 'Items (one per line)', 'afsv-vrc-core' ), "First item\nSecond item\nThird item", 'textarea' );
		$this->choose( 'style', __( 'Style', 'afsv-vrc-core' ), array( 'cells' => __( 'Grid of cells', 'afsv-vrc-core' ), 'rows' => __( 'Rows', 'afsv-vrc-core' ) ), 'cells' );
		$this->choose( 'band', __( 'Background', 'afsv-vrc-core' ), array( 'white' => __( 'White', 'afsv-vrc-core' ), 'cream' => __( 'Cream', 'afsv-vrc-core' ) ), 'white' );
		$this->end_controls_section();
	}

	protected function render() {
		$s     = $this->get_settings_for_display();
		$items = $this->lines( $s['items'] );
		echo '<section class="' . ( 'cream' === $s['band'] ? 'band--cream' : '' ) . '"><div class="wrap section">';
		if ( $s['heading'] ) {
			echo '<div class="section-head reveal"><h2 class="h2">' . esc_html( $s['heading'] ) . '</h2>' . ( $s['text'] ? '<p class="body-lg muted">' . esc_html( $s['text'] ) . '</p>' : '' ) . '</div>';
		}
		if ( 'rows' === $s['style'] ) {
			echo '<ul class="rows" data-stagger>';
			foreach ( $items as $i => $t ) {
				echo '<li><span class="num">' . esc_html( $this->pad2( $i + 1 ) ) . '</span><span>' . esc_html( $t ) . '</span></li>';
			}
			echo '</ul>';
		} else {
			echo '<div class="hairline list-cells" style="--min:255px" data-stagger>';
			foreach ( $items as $i => $t ) {
				echo '<div class="cell"><span class="num">' . esc_html( $this->pad2( $i + 1 ) ) . '</span><span>' . esc_html( $t ) . '</span></div>';
			}
			echo '</div>';
		}
		echo '</div></section>';
	}
}
