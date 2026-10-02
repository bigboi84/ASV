<?php
/**
 * AFSV Ticker: endless marquee of program areas.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

class AFSV_Widget_Ticker extends AFSV_Widget {

	public function get_name() {
		return 'afsv-ticker';
	}

	public function get_title() {
		return __( 'AFSV Ticker', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-slider-push';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Items', 'afsv-vrc-core' ) );
		$this->text( 'label', __( 'Accessible label', 'afsv-vrc-core' ), 'Program areas' );
		$this->text( 'items', __( 'Items (one per line)', 'afsv-vrc-core' ), "Multi-sport development\nSoccer\nCricket\nBasketball\nTrack and sprint\nAdaptive sport\nEsports\nAI education\nLife skills\nMentorship\nInclusive education\nCommunity", 'textarea' );
		$this->end_controls_section();
	}

	protected function render() {
		$s     = $this->get_settings_for_display();
		$items = $this->lines( $s['items'] );
		$li    = '';
		foreach ( $items as $t ) {
			$li .= '<li>' . esc_html( $t ) . '</li>';
		}
		echo '<div class="ticker" aria-label="' . esc_attr( $s['label'] ) . '"><div class="ticker__track"><ul>' . $li . '</ul><ul aria-hidden="true">' . $li . '</ul></div></div>'; // phpcs:ignore
	}
}
