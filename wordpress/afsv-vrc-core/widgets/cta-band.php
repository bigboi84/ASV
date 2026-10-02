<?php
/**
 * AFSV CTA Band: navy closing band with buttons.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class AFSV_Widget_CTA_Band extends AFSV_Widget {

	public function get_name() {
		return 'afsv-cta-band';
	}

	public function get_title() {
		return __( 'AFSV Call-to-Action Band', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-call-to-action';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'heading', __( 'Heading', 'afsv-vrc-core' ), 'Build the future with us.' );
		$this->repeater(
			'buttons',
			__( 'Buttons', 'afsv-vrc-core' ),
			array(
				'label' => array( __( 'Label', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'link'  => array( __( 'Link', 'afsv-vrc-core' ), Controls_Manager::URL ),
			),
			array(
				array( 'label' => 'Partner with us', 'link' => array( 'url' => '/partners' ) ),
				array( 'label' => 'Contact us', 'link' => array( 'url' => '/contact' ) ),
			),
			'{{{ label }}}'
		);
		$this->end_controls_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		?>
<section class="cta-band band--navy">
	<div class="wrap cta-band__inner">
		<h2 class="reveal"><?php echo esc_html( $s['heading'] ); ?></h2>
		<div class="btn-row btn-row--stack">
			<?php foreach ( $s['buttons'] as $i => $b ) : ?>
				<?php echo $this->btn( $b['label'], $b['link'], 0 === $i ? 'gold' : 'line-light' ); // phpcs:ignore ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>
		<?php
	}
}
