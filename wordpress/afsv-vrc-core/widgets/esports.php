<?php
/**
 * AFSV Esports Band: dark neon band for esports and media pathways.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class AFSV_Widget_Esports extends AFSV_Widget {

	public function get_name() {
		return 'afsv-esports';
	}

	public function get_title() {
		return __( 'AFSV Esports Band', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-play';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'badge', __( 'Badge', 'afsv-vrc-core' ), 'Dedicated esports site launching soon' );
		$this->text( 'eyebrow', __( 'Eyebrow', 'afsv-vrc-core' ), 'Esports, Technology, Media & Innovation' );
		$this->text( 'words', __( 'Title words (one per line)', 'afsv-vrc-core' ), "Compete.\nCreate.\nBroadcast.", 'textarea' );
		$this->text( 'lead', __( 'Text', 'afsv-vrc-core' ), 'Not every participant connects with traditional sport. AFSV VRC esports and media pathways are intended to build social connection, skills, confidence, storytelling and career exploration — from competition to the broadcast desk.', 'textarea' );
		$this->text( 'btn1', __( 'Primary button', 'afsv-vrc-core' ), 'Explore esports & media pathways' );
		$this->url( 'btn1_url', __( 'Primary link', 'afsv-vrc-core' ), '/technology-media' );
		$this->text( 'btn2', __( 'Secondary button', 'afsv-vrc-core' ), 'Get launch updates' );
		$this->url( 'btn2_url', __( 'Secondary link', 'afsv-vrc-core' ), '/technology-media#interest' );
		$this->text( 'note', __( 'Small print', 'afsv-vrc-core' ), 'Competition, production and podcast spaces are conceptual and not yet operational.' );
		$this->repeater(
			'modes',
			__( 'Pathways', 'afsv-vrc-core' ),
			array(
				't' => array( __( 'Title', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'd' => array( __( 'Description', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
			),
			array(
				array( 't' => 'Esports', 'd' => 'Team play, tournaments and coaching' ),
				array( 't' => 'Content creation', 'd' => 'Video, streaming and storytelling' ),
				array( 't' => 'Broadcasting', 'd' => 'Commentary, production and live coverage' ),
				array( 't' => 'Podcasting', 'd' => 'Participant and community voices' ),
				array( 't' => 'Coding & STEM', 'd' => 'Game design and technical skills' ),
			),
			'{{{ t }}}'
		);
		$this->end_controls_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		?>
<section class="esports">
	<div class="esports__grid" aria-hidden="true"><div class="esports__floor"></div></div>
	<div class="esports__glow" aria-hidden="true"></div>
	<div class="wrap esports__inner">
		<div class="esports__copy reveal">
			<?php if ( $s['badge'] ) : ?><p class="esports__badge"><span class="esports__dot" aria-hidden="true"></span><?php echo esc_html( $s['badge'] ); ?></p><?php endif; ?>
			<?php if ( $s['eyebrow'] ) : ?><p class="eyebrow"><?php echo esc_html( $s['eyebrow'] ); ?></p><?php endif; ?>
			<h2 class="esports__title"><?php foreach ( $this->lines( $s['words'] ) as $w ) : ?><span><?php echo esc_html( $w ); ?></span> <?php endforeach; ?></h2>
			<p class="lead"><?php echo esc_html( $s['lead'] ); ?></p>
			<div class="btn-row btn-row--stack">
				<?php echo $this->btn( $s['btn1'], $s['btn1_url'], 'gold' ); // phpcs:ignore ?>
				<?php echo $this->btn( $s['btn2'], $s['btn2_url'], 'line-light' ); // phpcs:ignore ?>
			</div>
			<?php if ( $s['note'] ) : ?><p class="esports__note"><?php echo esc_html( $s['note'] ); ?></p><?php endif; ?>
		</div>
		<ul class="esports__modes reveal" aria-label="<?php esc_attr_e( 'Esports and media pathways', 'afsv-vrc-core' ); ?>">
			<?php foreach ( $s['modes'] as $i => $m ) : ?>
			<li style="--i:<?php echo (int) $i; ?>"><span class="esports__key"><?php echo esc_html( $this->pad2( $i + 1 ) ); ?></span><span><b><?php echo esc_html( $m['t'] ); ?></b><small><?php echo esc_html( $m['d'] ); ?></small></span></li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>
		<?php
	}
}
