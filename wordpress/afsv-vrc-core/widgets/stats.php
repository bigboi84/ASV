<?php
/**
 * AFSV Stats: navy band with count-up figures.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class AFSV_Widget_Stats extends AFSV_Widget {

	public function get_name() {
		return 'afsv-stats';
	}

	public function get_title() {
		return __( 'AFSV Stats', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-counter';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'heading', __( 'Heading', 'afsv-vrc-core' ), 'The model, in numbers.' );
		$this->text( 'text', __( 'Intro', 'afsv-vrc-core' ), 'Planned scope for the first phase. Figures are proposals, not results, and stay labelled that way.', 'textarea' );
		$this->repeater(
			'stats',
			__( 'Figures', 'afsv-vrc-core' ),
			array(
				'value'  => array( __( 'Number', 'afsv-vrc-core' ), Controls_Manager::NUMBER ),
				'suffix' => array( __( 'Unit (optional)', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'label'  => array( __( 'Label', 'afsv-vrc-core' ), Controls_Manager::TEXTAREA ),
				'pill'   => array( __( 'Pill (optional)', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
			),
			array(
				array( 'value' => 4, 'suffix' => '', 'label' => 'Strategic pillars connecting sport, learning, inclusion and life skills', 'pill' => '' ),
				array( 'value' => 10, 'suffix' => '', 'label' => 'Program categories planned for the first cycle', 'pill' => '' ),
				array( 'value' => 150000, 'suffix' => 'sq ft', 'label' => 'Approximate Phase 1 floor area, subject to site, design, approvals and financing', 'pill' => 'Proposed' ),
				array( 'value' => 6, 'suffix' => '', 'label' => 'Facility zones, from the multi-sport dome to media and broadcast', 'pill' => '' ),
			),
			'{{{ value }}} {{{ suffix }}}'
		);
		$this->end_controls_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		?>
<section class="band--navy">
	<div class="wrap" style="padding-top:clamp(56px,7vw,88px);padding-bottom:clamp(56px,7vw,88px)">
		<?php if ( $s['heading'] ) : ?>
		<div class="section-head reveal"><h2 class="h2"><?php echo esc_html( $s['heading'] ); ?></h2><?php if ( $s['text'] ) : ?><p class="body-lg" style="color:var(--on-navy-soft)"><?php echo esc_html( $s['text'] ); ?></p><?php endif; ?></div>
		<?php endif; ?>
		<div class="stats" data-stagger>
			<?php foreach ( $s['stats'] as $st ) :
				$n = (float) $st['value'];
				?>
			<div class="stat">
				<span class="stat__value"><span data-count="<?php echo esc_attr( $n ); ?>"><?php echo esc_html( number_format_i18n( $n ) ); ?></span><?php echo $st['suffix'] ? '<small>' . esc_html( $st['suffix'] ) . '</small>' : ''; ?></span>
				<span class="stat__label"><?php echo esc_html( $st['label'] ); ?></span>
				<?php if ( $st['pill'] ) : ?><span class="pill pill--gold"><?php echo esc_html( $st['pill'] ); ?></span><?php endif; ?>
			</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
		<?php
	}
}
