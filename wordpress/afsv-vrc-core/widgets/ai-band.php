<?php
/**
 * AFSV AI Band: navy band with the animated constellation and a numbered list.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

class AFSV_Widget_AI_Band extends AFSV_Widget {

	public function get_name() {
		return 'afsv-ai-band';
	}

	public function get_title() {
		return __( 'AFSV AI Band', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-network';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'eyebrow', __( 'Eyebrow', 'afsv-vrc-core' ), 'GAISB and responsible AI' );
		$this->text( 'title', __( 'Title', 'afsv-vrc-core' ), 'Responsible innovation, taught properly.' );
		$this->text( 'lead', __( 'Text', 'afsv-vrc-core' ), 'Through its strategic relationship with the Global AI Standards Body, AFSV VRC is advancing AI education, certification, workforce readiness and responsible innovation across sport, education and community development in Canada and the Caribbean.', 'textarea' );
		$this->text( 'btn', __( 'Button', 'afsv-vrc-core' ), 'Explore AI Education & Partnerships' );
		$this->url( 'btn_url', __( 'Button link', 'afsv-vrc-core' ), '/gaisb-ai' );
		$this->text( 'items', __( 'List (one per line)', 'afsv-vrc-core' ), "AI literacy\nProfessional certification\nSport technology\nResponsible-AI governance\nWorkforce readiness", 'textarea' );
		$this->end_controls_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		?>
<section class="band--navy ai-band">
	<canvas class="ai-band__canvas" aria-hidden="true"></canvas>
	<div class="wrap section split split--center ai-band__inner">
		<div class="reveal">
			<?php if ( $s['eyebrow'] ) : ?><p class="eyebrow mb-s"><?php echo esc_html( $s['eyebrow'] ); ?></p><?php endif; ?>
			<h2 class="h2 mb-m"><?php echo esc_html( $s['title'] ); ?></h2>
			<p class="lead mb-l"><?php echo esc_html( $s['lead'] ); ?></p>
			<?php echo $this->btn( $s['btn'], $s['btn_url'], 'gold' ); // phpcs:ignore ?>
		</div>
		<ul class="ai-band__list reveal">
			<?php foreach ( $this->lines( $s['items'] ) as $i => $t ) : ?>
			<li><span class="num"><?php echo esc_html( $this->pad2( $i + 1 ) ); ?></span><?php echo esc_html( $t ); ?></li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>
		<?php
	}
}
