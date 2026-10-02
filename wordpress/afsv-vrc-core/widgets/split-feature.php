<?php
/**
 * AFSV Split Feature: image or video on one side, copy, checklist and button on the other.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

class AFSV_Widget_Split_Feature extends AFSV_Widget {

	public function get_name() {
		return 'afsv-split-feature';
	}

	public function get_title() {
		return __( 'AFSV Split Feature', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-image-box';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'eyebrow', __( 'Eyebrow', 'afsv-vrc-core' ), 'Neurodiversity Access & Opportunity' );
		$this->text( 'title', __( 'Title (one line per row)', 'afsv-vrc-core' ), "Different Minds.\nEqual Opportunity.", 'textarea' );
		$this->text( 'lead', __( 'Text', 'afsv-vrc-core' ), 'AFSV VRC is developing an inclusive ecosystem intended to expand access to sport, education, developmental support, life skills, technology and employment for neurodivergent people — reducing financial and accessibility barriers through qualified professionals, community organizations, businesses, sponsors and employers.', 'textarea' );
		$this->text( 'checks', __( 'Checklist (one per line)', 'afsv-vrc-core' ), "Sensory-friendly environments\nQualified service provider network\nNeurodiversity Access Fund\nNeuroinclusive employers", 'textarea' );
		$this->text( 'btn', __( 'Button', 'afsv-vrc-core' ), 'Explore Neurodiversity Access & Opportunity' );
		$this->url( 'btn_url', __( 'Button link', 'afsv-vrc-core' ), '/neurodiversity' );
		$this->end_controls_section();

		$this->section( 'media_sec', __( 'Media and layout', 'afsv-vrc-core' ) );
		$this->media( 'image', __( 'Image', 'afsv-vrc-core' ), 'sensory-support-space.jpg' );
		$this->text( 'alt', __( 'Image description (alt text)', 'afsv-vrc-core' ), 'Two adults in relaxed conversation in a calm, sensory-considerate support space with soft acoustic wall panels, dimmable lighting and quiet soft seating.', 'textarea' );
		$this->video_url();
		$this->choose(
			'band',
			__( 'Background', 'afsv-vrc-core' ),
			array(
				'cream' => __( 'Cream', 'afsv-vrc-core' ),
				'white' => __( 'White', 'afsv-vrc-core' ),
				'navy'  => __( 'Navy', 'afsv-vrc-core' ),
			),
			'cream'
		);
		$this->toggle( 'reverse', __( 'Image on the right', 'afsv-vrc-core' ), '' );
		$this->end_controls_section();
	}

	protected function render() {
		$s      = $this->get_settings_for_display();
		$band   = array( 'cream' => 'band--cream', 'white' => '', 'navy' => 'band--navy' );
		$figure = '<figure class="figure figure--4x3 figure--motion wipe" data-video-scope>' . $this->pmedia( $this->img_of( $s['image'] ), $s['alt'], $s['video'] ) . '</figure>';
		$title  = implode( '<br>', array_map( 'esc_html', $this->lines( $s['title'] ) ) );
		ob_start();
		?>
		<div class="reveal">
			<?php if ( $s['eyebrow'] ) : ?><p class="eyebrow mb-s"><?php echo esc_html( $s['eyebrow'] ); ?></p><?php endif; ?>
			<h2 class="h2 mb-m"><?php echo $title; // phpcs:ignore ?></h2>
			<p class="lead mb-m"><?php echo esc_html( $s['lead'] ); ?></p>
			<?php $checks = $this->lines( $s['checks'] ); ?>
			<?php if ( $checks ) : ?><ul class="check-list mb-l"><?php foreach ( $checks as $c ) : ?><li><?php echo esc_html( $c ); ?></li><?php endforeach; ?></ul><?php endif; ?>
			<?php echo $this->btn( $s['btn'], $s['btn_url'], 'navy' === $s['band'] ? 'gold' : 'navy' ); // phpcs:ignore ?>
		</div>
		<?php
		$copy = ob_get_clean();
		echo '<section class="' . esc_attr( $band[ $s['band'] ] ) . '"><div class="wrap section split split--center">';
		echo 'yes' === $s['reverse'] ? $copy . $figure : $figure . $copy; // phpcs:ignore
		echo '</div></section>';
	}
}
