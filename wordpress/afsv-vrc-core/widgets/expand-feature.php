<?php
/**
 * AFSV Expanding Feature: inset image/video that grows to full bleed on scroll, with a card.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

class AFSV_Widget_Expand_Feature extends AFSV_Widget {

	public function get_name() {
		return 'afsv-expand-feature';
	}

	public function get_title() {
		return __( 'AFSV Expanding Feature', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-image-rollover';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'pill', __( 'Pill', 'afsv-vrc-core' ), 'Proposed' );
		$this->text( 'title', __( 'Title', 'afsv-vrc-core' ), 'Whitby Smart Sports Village' );
		$this->text( 'lead', __( 'Text', 'afsv-vrc-core' ), 'Our proposed Whitby pilot is envisioned as a technology-enabled, multi-sport destination serving athletes, students, families, clubs, educators and community partners.', 'textarea' );
		$this->text( 'tags', __( 'Tags (one per line)', 'afsv-vrc-core' ), "Multi-sport dome\nPerformance & recovery\nLearning & life skills\nSensory-aware spaces\nEsports & broadcast", 'textarea' );
		$this->text( 'btn', __( 'Button', 'afsv-vrc-core' ), 'Discover the Vision' );
		$this->url( 'btn_url', __( 'Button link', 'afsv-vrc-core' ), '/whitby-smart-sports-village' );
		$this->text( 'caption', __( 'Caption bar', 'afsv-vrc-core' ), 'Conceptual Rendering — Not an Existing Facility' );
		$this->end_controls_section();

		$this->section( 'media_sec', __( 'Media', 'afsv-vrc-core' ) );
		$this->media( 'image', __( 'Image', 'afsv-vrc-core' ), 'whitby-aerial-concept.jpg' );
		$this->text( 'alt', __( 'Image description (alt text)', 'afsv-vrc-core' ), 'Conceptual rendering: aerial view of a proposed multi-sport village campus with linked low-rise pavilions, outdoor pitches, courts, solar canopies and tree-lined walkways. Not an existing facility.', 'textarea' );
		$this->video_url();
		$this->end_controls_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		?>
<section class="expand" data-expand>
	<div class="expand__frame" data-video-scope>
		<?php echo $this->pmedia( $this->img_of( $s['image'] ), $s['alt'], $s['video'], 0 ); // phpcs:ignore ?>
		<span class="expand__shade" aria-hidden="true"></span>
		<div class="wrap expand__content">
			<div class="expand__card reveal">
				<?php if ( $s['pill'] ) : ?><span class="pill pill--gold"><?php echo esc_html( $s['pill'] ); ?></span><?php endif; ?>
				<h2 class="h2"><?php echo esc_html( $s['title'] ); ?></h2>
				<p class="lead"><?php echo esc_html( $s['lead'] ); ?></p>
				<?php $tags = $this->lines( $s['tags'] ); ?>
				<?php if ( $tags ) : ?><ul class="expand__tags"><?php foreach ( $tags as $t ) : ?><li><?php echo esc_html( $t ); ?></li><?php endforeach; ?></ul><?php endif; ?>
				<?php echo $this->btn( $s['btn'], $s['btn_url'], 'gold' ); // phpcs:ignore ?>
			</div>
		</div>
		<?php if ( $s['caption'] ) : ?><p class="caption-bar expand__caption"><?php echo esc_html( $s['caption'] ); ?></p><?php endif; ?>
	</div>
</section>
		<?php
	}
}
