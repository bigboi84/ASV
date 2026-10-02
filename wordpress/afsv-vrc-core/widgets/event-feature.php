<?php
/**
 * AFSV Events: the next event (home) or the full upcoming list (Events page),
 * pulled from Events. Partner events render in their own brand.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

class AFSV_Widget_Event_Feature extends AFSV_Widget {

	public function get_name() {
		return 'afsv-event-feature';
	}

	public function get_title() {
		return __( 'AFSV Events', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-calendar';
	}

	protected function register_controls() {
		$events = array( '0' => __( 'Next upcoming event', 'afsv-vrc-core' ), 'all' => __( 'All upcoming events (list)', 'afsv-vrc-core' ) );
		foreach ( get_posts( array( 'post_type' => 'afsv_event', 'posts_per_page' => 50, 'post_status' => array( 'publish', 'draft' ) ) ) as $ev ) {
			$events[ (string) $ev->ID ] = get_the_title( $ev );
		}
		$this->section( 'content', __( 'Events', 'afsv-vrc-core' ) );
		$this->choose( 'source', __( 'Show', 'afsv-vrc-core' ), $events, '0' );
		$this->text( 'heading', __( 'Section heading (optional)', 'afsv-vrc-core' ), 'Upcoming event.' );
		$this->text( 'text', __( 'Intro', 'afsv-vrc-core' ), 'The first event on the AFSV VRC calendar.', 'textarea' );
		$this->text( 'link_label', __( 'Link label', 'afsv-vrc-core' ), 'All events' );
		$this->url( 'link', __( 'Link', 'afsv-vrc-core' ), '/events' );
		$this->text( 'side_label', __( 'Countdown label', 'afsv-vrc-core' ), 'Summit opens in' );
		$this->text( 'empty', __( 'Message when there are no events', 'afsv-vrc-core' ), 'Further events will be listed here as they are confirmed, including program showcases, partner sessions and Whitby Smart Sports Village milestones.', 'textarea' );
		$this->end_controls_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		if ( 'all' === $s['source'] ) {
			$posts = afsv_core_get_events( 'upcoming' );
		} elseif ( '0' === (string) $s['source'] ) {
			$posts = afsv_core_get_events( 'upcoming', 1 );
		} else {
			$posts = array_filter( array( get_post( (int) $s['source'] ) ) );
		}
		?>
<section class="wrap section event-section" id="events">
	<?php if ( $s['heading'] ) : ?>
	<div class="section-head reveal">
		<h2 class="h2"><?php echo esc_html( $s['heading'] ); ?></h2>
		<?php if ( $s['text'] || $s['link_label'] ) : ?>
		<p class="body-lg muted"><?php echo esc_html( $s['text'] ); ?>
			<?php if ( $s['link_label'] ) : ?> <a class="text-link" href="<?php echo esc_url( afsv_url( $this->link_of( $s['link'] ) ) ); ?>"><?php echo esc_html( $s['link_label'] ); ?> <?php echo afsv_arrow(); // phpcs:ignore ?></a><?php endif; ?>
		</p>
		<?php endif; ?>
	</div>
	<?php endif; ?>
	<?php if ( $posts ) : ?>
	<div class="event-list">
		<?php foreach ( $posts as $p ) : ?>
			<?php echo afsv_core_render_event( afsv_core_event_view( $p ), $s['side_label'] ); // phpcs:ignore ?>
		<?php endforeach; ?>
	</div>
	<?php endif; ?>
	<?php if ( ( 'all' === $s['source'] || ! $posts ) && $s['empty'] ) : ?>
	<div class="pending mt-l"><span class="eyebrow"><?php esc_html_e( 'More events', 'afsv-vrc-core' ); ?></span><p><?php echo esc_html( $s['empty'] ); ?></p></div>
	<?php endif; ?>
</section>
		<?php
	}
}
