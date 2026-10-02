<?php
/**
 * AFSV Pathway Cards: image cards with kicker, title and description.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class AFSV_Widget_Path_Cards extends AFSV_Widget {

	public function get_name() {
		return 'afsv-path-cards';
	}

	public function get_title() {
		return __( 'AFSV Pathway Cards', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-posts-grid';
	}

	protected function register_controls() {
		$a = function ( $f ) {
			return array( 'url' => afsv_asset( 'img/' . $f ) );
		};
		$this->section( 'content', __( 'Content', 'afsv-vrc-core' ) );
		$this->text( 'heading', __( 'Heading', 'afsv-vrc-core' ), 'Choose your pathway.' );
		$this->text( 'text', __( 'Intro', 'afsv-vrc-core' ), 'Four ways in. Each route reaches the team responsible for it.', 'textarea' );
		$this->repeater(
			'cards',
			__( 'Cards', 'afsv-vrc-core' ),
			array(
				'kicker' => array( __( 'Kicker', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'title'  => array( __( 'Title', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'desc'   => array( __( 'Description', 'afsv-vrc-core' ), Controls_Manager::TEXTAREA ),
				'image'  => array( __( 'Image', 'afsv-vrc-core' ), Controls_Manager::MEDIA ),
				'link'   => array( __( 'Link', 'afsv-vrc-core' ), Controls_Manager::URL ),
			),
			array(
				array( 'kicker' => 'Athletes & families', 'title' => 'Train and develop', 'desc' => 'Athlete pathways, coaching and multi-sport training.', 'image' => $a( 'news-courtside.jpg' ), 'link' => array( 'url' => '/programs' ) ),
				array( 'kicker' => 'Membership', 'title' => 'Become a member', 'desc' => 'Register interest in the five proposed membership pathways.', 'image' => $a( 'membership-community.jpg' ), 'link' => array( 'url' => '/membership' ) ),
				array( 'kicker' => 'Marketplace', 'title' => 'Shop the movement', 'desc' => 'Apparel, training products and community-focused goods.', 'image' => $a( 'marketplace-kit.jpg' ), 'link' => array( 'url' => '/marketplace' ) ),
				array( 'kicker' => 'Organisations', 'title' => 'Partner with us', 'desc' => 'Sponsorship, education, technology and development routes.', 'image' => $a( 'partners-boardroom.jpg' ), 'link' => array( 'url' => '/partners' ) ),
			),
			'{{{ title }}}'
		);
		$this->end_controls_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		?>
<section class="wrap section">
	<?php if ( $s['heading'] ) : ?><div class="section-head reveal"><h2 class="h2"><?php echo esc_html( $s['heading'] ); ?></h2><?php if ( $s['text'] ) : ?><p class="body-lg muted"><?php echo esc_html( $s['text'] ); ?></p><?php endif; ?></div><?php endif; ?>
	<div class="path-grid" data-stagger>
		<?php foreach ( $s['cards'] as $c ) : ?>
		<a class="path-card" href="<?php echo esc_url( afsv_url( $this->link_of( $c['link'] ) ) ); ?>">
			<span class="path-card__img"><?php if ( $this->img_of( $c['image'] ) ) : ?><img src="<?php echo esc_url( $this->img_of( $c['image'] ) ); ?>" alt="" width="1344" height="752" loading="lazy"><?php endif; ?></span>
			<span class="path-card__body">
				<span class="eyebrow"><?php echo esc_html( $c['kicker'] ); ?></span>
				<span class="path-card__title"><?php echo esc_html( $c['title'] ); ?></span>
				<span class="path-card__desc"><?php echo esc_html( $c['desc'] ); ?></span>
			</span>
			<span class="path-card__go" aria-hidden="true"><?php echo afsv_icon( 'arrow' ); // phpcs:ignore ?></span>
		</a>
		<?php endforeach; ?>
	</div>
</section>
		<?php
	}
}
