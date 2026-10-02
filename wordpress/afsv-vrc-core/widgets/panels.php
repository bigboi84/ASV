<?php
/**
 * AFSV Pillar Panels: statement plus expanding image panels.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class AFSV_Widget_Panels extends AFSV_Widget {

	public function get_name() {
		return 'afsv-panels';
	}

	public function get_title() {
		return __( 'AFSV Pillar Panels', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-gallery-justified';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Statement', 'afsv-vrc-core' ) );
		$this->text( 'eyebrow', __( 'Eyebrow', 'afsv-vrc-core' ), 'One connected ecosystem' );
		$this->text( 'strong', __( 'Statement lead-in (bold)', 'afsv-vrc-core' ), 'Sport is only the beginning.' );
		$this->text( 'statement', __( 'Statement', 'afsv-vrc-core' ), 'AFSV VRC brings together athlete development, academic success, neurodivergent support and inclusive education, life skills, technology, community programming and commercial opportunity in one connected platform.', 'textarea' );
		$this->end_controls_section();

		$this->section( 'panels_sec', __( 'Panels', 'afsv-vrc-core' ) );
		$a = function ( $f ) {
			return array( 'url' => afsv_asset( 'img/' . $f ) );
		};
		$this->repeater(
			'panels',
			__( 'Panels', 'afsv-vrc-core' ),
			array(
				'num'   => array( __( 'Number', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'title' => array( __( 'Title', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'desc'  => array( __( 'Description', 'afsv-vrc-core' ), Controls_Manager::TEXTAREA ),
				'image' => array( __( 'Image', 'afsv-vrc-core' ), Controls_Manager::MEDIA ),
				'link'  => array( __( 'Link', 'afsv-vrc-core' ), Controls_Manager::URL ),
			),
			array(
				array( 'num' => '01', 'title' => 'Sports Development', 'desc' => 'Athlete pathways, coaching and multi-sport training.', 'image' => $a( 'pillars-hall.jpg' ), 'link' => array( 'url' => '/programs' ) ),
				array( 'num' => '02', 'title' => 'Education & Academic Success', 'desc' => 'Academic support alongside athletic development.', 'image' => $a( 'ai-education-studio.jpg' ), 'link' => array( 'url' => '/education' ) ),
				array( 'num' => '03', 'title' => 'Neurodiversity Access & Opportunity', 'desc' => 'Access, support and opportunity built in from the start.', 'image' => $a( 'accessible-entrance.jpg' ), 'link' => array( 'url' => '/neurodiversity' ) ),
				array( 'num' => '04', 'title' => 'Life Skills', 'desc' => 'Readiness for work, study and independent life.', 'image' => $a( 'about-team.jpg' ), 'link' => array( 'url' => '/life-skills' ) ),
			),
			'{{{ num }}} {{{ title }}}'
		);
		$this->text( 'go', __( 'Panel link text', 'afsv-vrc-core' ), 'Explore' );
		$this->end_controls_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		?>
<section class="wrap section" id="ecosystem">
	<?php if ( $s['statement'] || $s['strong'] ) : ?>
	<div class="statement reveal">
		<?php if ( $s['eyebrow'] ) : ?><p class="eyebrow"><?php echo esc_html( $s['eyebrow'] ); ?></p><?php endif; ?>
		<p class="statement__text"><?php echo $s['strong'] ? '<strong>' . esc_html( $s['strong'] ) . '</strong> ' : ''; ?><?php echo esc_html( $s['statement'] ); ?></p>
	</div>
	<?php endif; ?>
	<div class="panels" data-panels>
		<?php foreach ( $s['panels'] as $i => $p ) : ?>
		<a class="panel-card<?php echo 0 === $i ? ' is-active' : ''; ?>" href="<?php echo esc_url( afsv_url( $this->link_of( $p['link'] ) ) ); ?>">
			<?php if ( $this->img_of( $p['image'] ) ) : ?><img src="<?php echo esc_url( $this->img_of( $p['image'] ) ); ?>" alt="" width="1344" height="752" loading="lazy"><?php endif; ?>
			<span class="panel-card__shade" aria-hidden="true"></span>
			<span class="panel-card__num"><?php echo esc_html( $p['num'] ); ?></span>
			<span class="panel-card__body">
				<span class="panel-card__title"><?php echo esc_html( $p['title'] ); ?></span>
				<span class="panel-card__desc"><?php echo esc_html( $p['desc'] ); ?></span>
				<span class="panel-card__go"><?php echo esc_html( $s['go'] ); ?> <?php echo afsv_arrow(); // phpcs:ignore ?></span>
			</span>
		</a>
		<?php endforeach; ?>
	</div>
</section>
		<?php
	}
}
