<?php
/**
 * AFSV Hero: full-bleed home hero with background video, word cascade headline and fact strip.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class AFSV_Widget_Hero extends AFSV_Widget {

	public function get_name() {
		return 'afsv-hero';
	}

	public function get_title() {
		return __( 'AFSV Hero (full screen)', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-banner';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'eyebrow', __( 'Eyebrow', 'afsv-vrc-core' ), 'AFSV VRC Global Development Group' );
		$this->text( 'headline', __( 'Headline (one line per row)', 'afsv-vrc-core' ), "Building Athletes.\nEmpowering Minds.\nStrengthening Communities.", 'textarea' );
		$this->text( 'ink', __( 'Underlined words (comma separated)', 'afsv-vrc-core' ), 'Communities.' );
		$this->text( 'lead', __( 'Lead paragraph', 'afsv-vrc-core' ), 'AFSV VRC is creating a smarter, more inclusive sports and education ecosystem where athletes, families, educators, partners and communities can train, learn, connect and grow.', 'textarea' );
		$this->text( 'btn1', __( 'Primary button', 'afsv-vrc-core' ), 'Explore the Smart Sports Village' );
		$this->url( 'btn1_url', __( 'Primary link', 'afsv-vrc-core' ), '/whitby-smart-sports-village' );
		$this->text( 'btn2', __( 'Secondary button', 'afsv-vrc-core' ), 'Join the Movement' );
		$this->url( 'btn2_url', __( 'Secondary link', 'afsv-vrc-core' ), '/membership' );
		$this->end_controls_section();

		$this->section( 'media_sec', __( 'Background', 'afsv-vrc-core' ) );
		$this->media( 'image', __( 'Poster image', 'afsv-vrc-core' ), 'hero-fieldhouse.jpg' );
		$this->add_control(
			'video',
			array(
				'label'       => __( 'Background video URL (MP4)', 'afsv-vrc-core' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => afsv_asset( 'video/hero-loop.mp4' ),
				'label_block' => true,
			)
		);
		$this->text( 'video_desc', __( 'Video description (screen readers)', 'afsv-vrc-core' ), 'Background video: adult athletes training in a modern indoor fieldhouse — a sprinter on the track, an athlete adjusting a wheelchair racing frame, and two athletes talking courtside in low evening light.', 'textarea' );
		$this->toggle( 'lanes', __( 'Animated track lanes', 'afsv-vrc-core' ) );
		$this->end_controls_section();

		$this->section( 'facts_sec', __( 'Fact strip', 'afsv-vrc-core' ) );
		$this->repeater(
			'facts',
			__( 'Facts', 'afsv-vrc-core' ),
			array(
				'k'    => array( __( 'Label', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'v'    => array( __( 'Value', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'pill' => array( __( 'Pill (optional)', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'link' => array( __( 'Link', 'afsv-vrc-core' ), Controls_Manager::URL ),
			),
			array(
				array( 'k' => 'Pilot', 'v' => 'Whitby, Ontario', 'pill' => 'Proposed', 'link' => array( 'url' => '/whitby-smart-sports-village' ) ),
				array( 'k' => 'Model', 'v' => '4 strategic pillars', 'pill' => '', 'link' => array( 'url' => '/strategic-pillars' ) ),
				array( 'k' => 'Reach', 'v' => 'Canada · Caribbean · Global', 'pill' => '', 'link' => array( 'url' => '/about' ) ),
				array( 'k' => 'Book. Train. Perform.', 'v' => 'Book a session', 'pill' => '', 'link' => array( 'url' => AFSV_BOOKING_URL ) ),
			),
			'{{{ k }}} — {{{ v }}}'
		);
		$this->end_controls_section();
	}

	protected function render() {
		$s     = $this->get_settings_for_display();
		$img   = $this->img_of( $s['image'] );
		$title = $this->heading_text( $s['headline'] );
		?>
<section class="hero hero--full">
	<div class="hero__media">
		<?php if ( $img ) : ?><img src="<?php echo esc_url( $img ); ?>" alt="" width="1344" height="752" fetchpriority="high"><?php endif; ?>
		<?php if ( $s['video'] ) : ?><video src="<?php echo esc_url( $s['video'] ); ?>"<?php echo $img ? ' poster="' . esc_url( $img ) . '"' : ''; ?> muted loop playsinline autoplay preload="metadata" aria-hidden="true" tabindex="-1"></video><?php endif; ?>
	</div>
	<div class="hero__scrim" aria-hidden="true"></div>
	<?php if ( 'yes' === $s['lanes'] ) : ?>
	<svg class="hero__lanes" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true" focusable="false">
		<path d="M-40 690 C 380 610, 820 640, 1480 470"/>
		<path d="M-40 730 C 400 650, 860 690, 1480 520"/>
		<path d="M-40 770 C 420 690, 900 740, 1480 570"/>
		<path class="runner" d="M-40 730 C 400 650, 860 690, 1480 520"/>
	</svg>
	<?php endif; ?>
	<div class="wrap hero__content">
		<div class="hero__copy">
			<?php if ( $s['eyebrow'] ) : ?><p class="eyebrow eyebrow-rule"><?php echo esc_html( $s['eyebrow'] ); ?></p><?php endif; ?>
			<h1 class="display split-words" aria-label="<?php echo esc_attr( $title ); ?>"><span aria-hidden="true"><?php echo $this->split_words( $s['headline'], $s['ink'] ); // phpcs:ignore ?></span></h1>
			<?php if ( $s['lead'] ) : ?><p class="lead"><?php echo esc_html( $s['lead'] ); ?></p><?php endif; ?>
			<div class="btn-row btn-row--stack">
				<?php echo $this->btn( $s['btn1'], $s['btn1_url'], 'gold' ); // phpcs:ignore ?>
				<?php echo $this->btn( $s['btn2'], $s['btn2_url'], 'line-light' ); // phpcs:ignore ?>
			</div>
		</div>
	</div>
	<?php if ( ! empty( $s['facts'] ) ) : ?>
	<div class="hero__facts">
		<div class="wrap hero__facts-inner">
			<?php
			$n = count( $s['facts'] );
			foreach ( $s['facts'] as $i => $f ) :
				$href = afsv_url( $this->link_of( $f['link'] ) );
				$ext  = afsv_is_external( $href );
				$last = $ext && $i === $n - 1;
				?>
			<a class="hero__fact<?php echo $last ? ' hero__fact--book' : ''; ?>" href="<?php echo esc_url( $href ); ?>"<?php echo $ext ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>>
				<span class="hero__fact-k"><?php echo esc_html( $f['k'] ); ?></span>
				<span class="hero__fact-v"><?php echo esc_html( $f['v'] ); ?><?php echo $ext ? ' ' . afsv_icon( 'external' ) : ''; // phpcs:ignore ?></span>
				<?php if ( $f['pill'] ) : ?><span class="pill pill--gold"><?php echo esc_html( $f['pill'] ); ?></span><?php endif; ?>
				<?php if ( $ext ) : ?><span class="sr-only"> <?php esc_html_e( '(opens in a new tab)', 'afsv-vrc-core' ); ?></span><?php endif; ?>
			</a>
			<?php endforeach; ?>
		</div>
	</div>
	<?php endif; ?>
	<?php if ( $s['video'] ) : ?>
	<button type="button" class="media-toggle" aria-pressed="false"><?php echo afsv_icon( 'pause', 'ico-pause' ) . afsv_icon( 'play', 'ico-play' ); // phpcs:ignore ?><span><?php esc_html_e( 'Pause background video', 'afsv-vrc-core' ); ?></span></button>
	<?php if ( $s['video_desc'] ) : ?><p class="sr-only"><?php echo esc_html( $s['video_desc'] ); ?></p><?php endif; ?>
	<?php endif; ?>
</section>
		<?php
	}
}
