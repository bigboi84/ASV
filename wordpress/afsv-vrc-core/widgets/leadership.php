<?php
/**
 * AFSV Leadership: renders the Leadership entries as team cards, a hero with
 * leader chips, or full alternating profiles.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

class AFSV_Widget_Leadership extends AFSV_Widget {

	public function get_name() {
		return 'afsv-leadership';
	}

	public function get_title() {
		return __( 'AFSV Leadership', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-person';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Leadership', 'afsv-vrc-core' ) );
		$this->choose(
			'layout',
			__( 'Layout', 'afsv-vrc-core' ),
			array(
				'cards'    => __( 'Team cards (About page)', 'afsv-vrc-core' ),
				'hero'     => __( 'Hero with leader chips (Leadership page top)', 'afsv-vrc-core' ),
				'profiles' => __( 'Full profiles (Leadership page)', 'afsv-vrc-core' ),
			),
			'cards'
		);
		$this->text( 'eyebrow', __( 'Eyebrow (hero)', 'afsv-vrc-core' ), 'Leadership team' );
		$this->text( 'heading', __( 'Heading', 'afsv-vrc-core' ), 'The leadership team.' );
		$this->text( 'ink', __( 'Underlined words (hero)', 'afsv-vrc-core' ), 'vision.' );
		$this->text( 'text', __( 'Intro', 'afsv-vrc-core' ), 'The people guiding governance, operations and investment across AFSVHCL.', 'textarea' );
		$this->text( 'link_label', __( 'Link label (cards)', 'afsv-vrc-core' ), 'Full profiles' );
		$this->url( 'link', __( 'Leadership page', 'afsv-vrc-core' ), '/leadership' );
		$this->add_control(
			'note',
			array(
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw'  => esc_html__( 'People come from Leadership in the admin menu. Set the order with "Order" (Page attributes) and add a featured image for the portrait.', 'afsv-vrc-core' ),
			)
		);
		$this->end_controls_section();
	}

	protected function render() {
		$s       = $this->get_settings_for_display();
		$leaders = array_map( 'afsv_core_leader_view', afsv_core_get_leaders() );
		if ( ! $leaders ) {
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<p class="wrap section">' . esc_html__( 'Add people under Leadership in the admin menu to fill this section.', 'afsv-vrc-core' ) . '</p>';
			}
			return;
		}
		$page = afsv_url( $this->link_of( $s['link'] ) );
		$fn   = 'render_' . $s['layout'];
		if ( method_exists( $this, $fn ) ) {
			$this->$fn( $s, $leaders, $page );
		}
	}

	protected function render_cards( $s, $leaders, $page ) {
		?>
<section class="wrap section">
	<div class="section-head reveal"><h2 class="h2"><?php echo esc_html( $s['heading'] ); ?></h2><p class="body-lg muted"><?php echo esc_html( $s['text'] ); ?><?php if ( $s['link_label'] ) : ?> <a class="text-link" href="<?php echo esc_url( $page ); ?>"><?php echo esc_html( $s['link_label'] ); ?> <?php echo afsv_arrow(); // phpcs:ignore ?></a><?php endif; ?></p></div>
	<div class="team" data-stagger>
		<?php foreach ( $leaders as $p ) : ?>
		<a class="team-card" href="<?php echo esc_url( $page . '#' . $p['slug'] ); ?>">
			<?php echo afsv_core_portrait( $p, 'team-card__photo' ); // phpcs:ignore ?>
			<span class="team-card__body">
				<span class="team-card__role"><?php echo esc_html( $p['role'] ); ?></span>
				<span class="team-card__name"><?php echo esc_html( $p['name'] ); ?></span>
				<span class="team-card__short"><?php echo esc_html( $p['short'] ); ?></span>
				<span class="team-card__go"><?php esc_html_e( 'View profile', 'afsv-vrc-core' ); ?> <?php echo afsv_arrow(); // phpcs:ignore ?></span>
			</span>
		</a>
		<?php endforeach; ?>
	</div>
</section>
		<?php
	}

	protected function render_hero( $s, $leaders, $page ) {
		$title = $this->heading_text( $s['heading'] );
		?>
<section class="lead-hero">
	<div class="wrap lead-hero__inner">
		<?php if ( $s['eyebrow'] ) : ?><p class="eyebrow eyebrow-rule"><?php echo esc_html( $s['eyebrow'] ); ?></p><?php endif; ?>
		<h1 class="h1 split-words" aria-label="<?php echo esc_attr( $title ); ?>"><span aria-hidden="true"><?php echo $this->split_words( $s['heading'], $s['ink'] ); // phpcs:ignore ?></span></h1>
		<p class="lead"><?php echo esc_html( $s['text'] ); ?></p>
		<nav class="lead-chips" aria-label="<?php esc_attr_e( 'Leaders', 'afsv-vrc-core' ); ?>">
			<?php foreach ( $leaders as $p ) : ?>
			<a href="#<?php echo esc_attr( $p['slug'] ); ?>"><?php echo afsv_core_portrait( $p, 'lead-chips__img' ); // phpcs:ignore ?><span><b><?php echo esc_html( $p['name'] ); ?></b><small><?php echo esc_html( $p['role'] ); ?></small></span></a>
			<?php endforeach; ?>
		</nav>
	</div>
</section>
		<?php
	}

	protected function render_profiles( $s, $leaders, $page ) {
		$total = count( $leaders );
		foreach ( $leaders as $i => $p ) :
			?>
<section class="profile<?php echo $i % 2 ? ' profile--alt' : ''; ?>" id="<?php echo esc_attr( $p['slug'] ); ?>" aria-labelledby="<?php echo esc_attr( $p['slug'] ); ?>-name">
	<div class="wrap section profile__grid">
		<div class="profile__aside">
			<div class="profile__sticky">
				<?php echo afsv_core_portrait( $p, 'profile__photo wipe' ); // phpcs:ignore ?>
				<div class="profile__id">
					<span class="num"><?php echo esc_html( $this->pad2( $i + 1 ) . ' / ' . $this->pad2( $total ) ); ?></span>
					<h2 class="profile__name" id="<?php echo esc_attr( $p['slug'] ); ?>-name"><?php echo esc_html( $p['name'] ); ?></h2>
					<p class="profile__role"><?php echo esc_html( $p['role'] ); ?></p>
				</div>
			</div>
		</div>
		<div class="profile__main">
			<?php if ( $p['short'] ) : ?><p class="profile__short reveal"><?php echo esc_html( $p['short'] ); ?></p><?php endif; ?>
			<?php if ( $p['quote'] ) : ?><figure class="profile__quote reveal"><blockquote><?php echo esc_html( $p['quote'] ); ?></blockquote><?php if ( $p['quote_by'] ) : ?><figcaption><?php echo esc_html( $p['quote_by'] ); ?></figcaption><?php endif; ?></figure><?php endif; ?>
			<div class="profile__bio reveal"><?php foreach ( $p['bio'] as $para ) : ?><p><?php echo esc_html( $para ); ?></p><?php endforeach; ?></div>
			<?php if ( $p['focus'] ) : ?>
			<div class="profile__focus" data-stagger><?php foreach ( $p['focus'] as $f ) : ?><div><b><?php echo esc_html( $f['t'] ); ?></b><span><?php echo esc_html( $f['d'] ); ?></span></div><?php endforeach; ?></div>
			<?php endif; ?>
		</div>
	</div>
</section>
			<?php
		endforeach;
	}
}
