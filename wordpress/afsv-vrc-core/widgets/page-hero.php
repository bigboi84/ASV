<?php
/**
 * AFSV Page Hero: inner-page hero, text left and media bleeding off the right edge.
 * Optional breadcrumb above it.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class AFSV_Widget_Page_Hero extends AFSV_Widget {

	public function get_name() {
		return 'afsv-page-hero';
	}

	public function get_title() {
		return __( 'AFSV Page Hero', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-header';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->toggle( 'breadcrumb', __( 'Show breadcrumb', 'afsv-vrc-core' ) );
		$this->text( 'eyebrow', __( 'Eyebrow', 'afsv-vrc-core' ), 'Page section' );
		$this->text( 'title', __( 'Title (one line per row)', 'afsv-vrc-core' ), 'Page title.', 'textarea' );
		$this->text( 'ink', __( 'Underlined words (comma separated)', 'afsv-vrc-core' ), '' );
		$this->text( 'lead', __( 'Lead paragraph', 'afsv-vrc-core' ), '', 'textarea' );
		$this->repeater(
			'buttons',
			__( 'Buttons', 'afsv-vrc-core' ),
			array(
				'label' => array( __( 'Label', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'link'  => array( __( 'Link', 'afsv-vrc-core' ), Controls_Manager::URL ),
			),
			array(),
			'{{{ label }}}'
		);
		$this->end_controls_section();

		$this->section( 'media_sec', __( 'Media', 'afsv-vrc-core' ) );
		$this->media( 'image', __( 'Image', 'afsv-vrc-core' ), 'pillars-hall.jpg' );
		$this->text( 'alt', __( 'Image description (alt text)', 'afsv-vrc-core' ), '' );
		$this->video_url();
		$this->end_controls_section();
	}

	protected function render() {
		$s     = $this->get_settings_for_display();
		$title = $this->heading_text( $s['title'] );
		if ( 'yes' === $s['breadcrumb'] ) {
			echo $this->breadcrumb(); // phpcs:ignore
		}
		?>
<section class="page-hero">
	<div class="wrap page-hero__grid">
		<div class="page-hero__text">
			<?php if ( $s['eyebrow'] ) : ?><p class="eyebrow eyebrow-rule"><?php echo esc_html( $s['eyebrow'] ); ?></p><?php endif; ?>
			<h1 class="h1 split-words" aria-label="<?php echo esc_attr( $title ); ?>"><span aria-hidden="true"><?php echo $this->split_words( $s['title'], $s['ink'] ); // phpcs:ignore ?></span></h1>
			<?php if ( $s['lead'] ) : ?><p class="lead"><?php echo esc_html( $s['lead'] ); ?></p><?php endif; ?>
			<?php if ( ! empty( $s['buttons'] ) ) : ?>
			<div class="btn-row btn-row--stack">
				<?php foreach ( $s['buttons'] as $i => $b ) : ?>
					<?php echo $this->btn( $b['label'], $b['link'], 0 === $i ? 'gold' : 'line-light' ); // phpcs:ignore ?>
				<?php endforeach; ?>
			</div>
			<?php endif; ?>
		</div>
		<div class="page-hero__media" data-video-scope><?php echo $this->pmedia( $this->img_of( $s['image'] ), $s['alt'], $s['video'], 0.06, true ); // phpcs:ignore ?></div>
	</div>
</section>
		<?php
	}

	/** Home / ancestors / current page. */
	protected function breadcrumb() {
		$id    = get_queried_object_id();
		$items = array( array( __( 'Home', 'afsv-vrc-core' ), home_url( '/' ) ) );
		foreach ( array_reverse( get_post_ancestors( $id ) ) as $anc ) {
			$items[] = array( get_the_title( $anc ), get_permalink( $anc ) );
		}
		$out = '<nav class="breadcrumb wrap" aria-label="' . esc_attr__( 'Breadcrumb', 'afsv-vrc-core' ) . '"><ol>';
		foreach ( $items as $it ) {
			$out .= '<li><a href="' . esc_url( $it[1] ) . '">' . esc_html( $it[0] ) . '</a></li><li aria-hidden="true">/</li>';
		}
		return $out . '<li aria-current="page">' . esc_html( get_the_title( $id ) ) . '</li></ol></nav>';
	}
}
