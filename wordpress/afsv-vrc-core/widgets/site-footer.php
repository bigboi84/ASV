<?php
/**
 * AFSV Site Footer. Place it in an Elementor template with the slug "afsv-site-footer".
 * Columns come from the Footer column menu locations (or the design defaults);
 * the Events column fills itself from upcoming Events.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

class AFSV_Widget_Site_Footer extends AFSV_Widget {

	public function get_name() {
		return 'afsv-site-footer';
	}

	public function get_title() {
		return __( 'AFSV Site Footer', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-footer';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Footer', 'afsv-vrc-core' ) );
		$this->media( 'logo', __( 'Logo', 'afsv-vrc-core' ), 'logo-reverse.png' );
		$this->text( 'tagline', __( 'Tagline', 'afsv-vrc-core' ), 'Building Athletes. Empowering Minds. Strengthening Communities.' );
		$this->text( 'contact_text', __( 'Contact note', 'afsv-vrc-core' ), 'A public inquiry mailbox will be published once routing is confirmed. Until then, the contact form reaches the right team.', 'textarea' );
		$this->text( 'contact_link', __( 'Contact link label', 'afsv-vrc-core' ), 'Contact AFSV VRC' );
		$this->url( 'contact_url', __( 'Contact link', 'afsv-vrc-core' ), '/contact' );
		$this->text( 'legal_note', __( 'Copyright note', 'afsv-vrc-core' ), 'Proposed and planned items are future-state and not yet operational.' );
		$this->add_control(
			'columns_note',
			array(
				'type' => \Elementor\Controls_Manager::RAW_HTML,
				'raw'  => esc_html__( 'Link columns: assign menus to "Footer column 1–4" and "Footer legal bar" in Appearance → Menus. The Events column lists upcoming events automatically.', 'afsv-vrc-core' ),
			)
		);
		$this->end_controls_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		get_template_part(
			'template-parts/site-footer',
			null,
			array(
				'logo'         => $this->img_of( $s['logo'] ) ? $this->img_of( $s['logo'] ) : afsv_logo( 'light' ),
				'tagline'      => $s['tagline'],
				'contact_text' => $s['contact_text'],
				'contact_link' => $s['contact_link'],
				'contact_url'  => $this->link_of( $s['contact_url'] ),
				'legal_note'   => $s['legal_note'],
			)
		);
	}
}
