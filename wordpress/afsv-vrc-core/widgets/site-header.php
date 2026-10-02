<?php
/**
 * AFSV Site Header: announcement, logo, dropdown navigation, mobile drawer.
 * Place it in an Elementor template with the slug "afsv-site-header".
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

class AFSV_Widget_Site_Header extends AFSV_Widget {

	public function get_name() {
		return 'afsv-site-header';
	}

	public function get_title() {
		return __( 'AFSV Site Header', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-header';
	}

	protected function register_controls() {
		$menus = array( '0' => __( 'Primary location (or design defaults)', 'afsv-vrc-core' ) );
		foreach ( wp_get_nav_menus() as $menu ) {
			$menus[ (string) $menu->term_id ] = $menu->name;
		}

		$this->section( 'content', __( 'Header', 'afsv-vrc-core' ) );
		$this->choose( 'menu', __( 'Menu', 'afsv-vrc-core' ), $menus, '0' );
		$this->choose(
			'overlay',
			__( 'Header style', 'afsv-vrc-core' ),
			array(
				'auto' => __( 'Per page (page setting)', 'afsv-vrc-core' ),
				'on'   => __( 'Always float over hero', 'afsv-vrc-core' ),
				'off'  => __( 'Always solid', 'afsv-vrc-core' ),
			),
			'auto'
		);
		$this->media( 'logo_dark', __( 'Logo (solid header)', 'afsv-vrc-core' ), 'logo.png' );
		$this->media( 'logo_light', __( 'Logo (over hero / drawer)', 'afsv-vrc-core' ), 'logo-reverse.png' );
		$this->text( 'book_label', __( 'Drawer button label', 'afsv-vrc-core' ), 'Book Now' );
		$this->url( 'book_url', __( 'Drawer button link', 'afsv-vrc-core' ), AFSV_BOOKING_URL );
		$this->text( 'contact_label', __( 'Drawer contact label', 'afsv-vrc-core' ), 'Contact' );
		$this->url( 'contact_url', __( 'Drawer contact link', 'afsv-vrc-core' ), '/contact' );
		$this->end_controls_section();

		$this->section( 'notice', __( 'Announcement bar', 'afsv-vrc-core' ) );
		$this->toggle( 'show_announce', __( 'Show announcement', 'afsv-vrc-core' ) );
		$this->text( 'announce', __( 'Text', 'afsv-vrc-core' ), 'AFSV VRC is in active development. Facilities, programs and partnerships shown as proposed or planned are future-state concepts and are not yet operational.', 'textarea' );
		$this->end_controls_section();
	}

	protected function render() {
		$s       = $this->get_settings_for_display();
		$overlay = 'on' === $s['overlay'] ? true : ( 'off' === $s['overlay'] ? false : afsv_header_overlay() );
		get_template_part(
			'template-parts/site-header',
			null,
			array(
				'overlay'       => $overlay,
				'menu'          => (int) $s['menu'],
				'show_announce' => 'yes' === $s['show_announce'],
				'announce'      => $s['announce'],
				'book_label'    => $s['book_label'],
				'book_url'      => $this->link_of( $s['book_url'] ),
				'contact_label' => $s['contact_label'],
				'contact_url'   => $this->link_of( $s['contact_url'] ),
				'logo_dark'     => $this->img_of( $s['logo_dark'] ) ? $this->img_of( $s['logo_dark'] ) : afsv_logo( 'dark' ),
				'logo_light'    => $this->img_of( $s['logo_light'] ) ? $this->img_of( $s['logo_light'] ) : afsv_logo( 'light' ),
			)
		);
	}
}
