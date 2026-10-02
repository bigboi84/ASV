<?php
/**
 * AFSV Interest Form: intro copy plus an accessible form. Submissions are saved in
 * wp-admin (Form submissions) and emailed. Turn "Send submissions" off to keep it as a preview.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

class AFSV_Widget_Interest_Form extends AFSV_Widget {

	public function get_name() {
		return 'afsv-interest-form';
	}

	public function get_title() {
		return __( 'AFSV Interest Form', 'afsv-vrc-core' );
	}

	public function get_icon() {
		return 'eicon-form-horizontal';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Intro', 'afsv-vrc-core' ) );
		$this->text( 'anchor', __( 'Section ID (for links like #register)', 'afsv-vrc-core' ), 'register' );
		$this->text( 'title', __( 'Title', 'afsv-vrc-core' ), 'Register your interest.' );
		$this->text( 'lead', __( 'Text', 'afsv-vrc-core' ), 'Tell us which pathway matters to you and we will be in touch as programs, membership and facilities are confirmed.', 'textarea' );
		$this->text( 'note', __( 'Privacy note', 'afsv-vrc-core' ), 'We ask only for what we need to reply. Please do not include diagnoses, medical records or details about a child in this form.', 'textarea' );
		$this->end_controls_section();

		$this->section( 'form_sec', __( 'Form', 'afsv-vrc-core' ) );
		$this->text( 'form_id', __( 'Form name (used in the inbox)', 'afsv-vrc-core' ), 'register-interest' );
		$this->repeater(
			'fields',
			__( 'Fields', 'afsv-vrc-core' ),
			array(
				'label'   => array( __( 'Label', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'type'    => array( __( 'Type: text, email, tel, url, select, textarea', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'options' => array( __( 'Options for select (one per line)', 'afsv-vrc-core' ), Controls_Manager::TEXTAREA ),
				'req'     => array( __( 'Required (yes/no)', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
				'full'    => array( __( 'Full width (yes/no)', 'afsv-vrc-core' ), Controls_Manager::TEXT ),
			),
			array(
				array( 'label' => 'Name', 'type' => 'text', 'options' => '', 'req' => 'yes', 'full' => 'no' ),
				array( 'label' => 'Email', 'type' => 'email', 'options' => '', 'req' => 'yes', 'full' => 'no' ),
				array( 'label' => 'Interest pathway', 'type' => 'select', 'options' => "Train and develop\nBecome a member\nShop the movement\nPartner with us\nNeurodiversity access and opportunity\nJoin the service provider network", 'req' => 'yes', 'full' => 'yes' ),
			),
			'{{{ label }}}'
		);
		$this->text( 'consent', __( 'Consent checkbox text (optional)', 'afsv-vrc-core' ), 'I agree to receive occasional updates from AFSV VRC. You can unsubscribe at any time.', 'textarea' );
		$this->toggle( 'consent_req', __( 'Consent required', 'afsv-vrc-core' ), '' );
		$this->text( 'submit', __( 'Button', 'afsv-vrc-core' ), 'Register interest' );
		$this->text( 'success', __( 'Thank-you message', 'afsv-vrc-core' ), 'We have your details and will be in touch as programs, membership and facilities are confirmed.', 'textarea' );
		$this->toggle( 'send', __( 'Send submissions (off = preview only)', 'afsv-vrc-core' ) );
		$this->end_controls_section();
	}

	protected function render() {
		$s      = $this->get_settings_for_display();
		$uid    = 'f' . substr( $this->get_id(), 0, 6 );
		$labels = array();
		$auto   = array( 'name' => 'name', 'email' => 'email', 'phone' => 'tel', 'organisation' => 'organization', 'organization' => 'organization' );
		ob_start();
		foreach ( $s['fields'] as $i => $f ) {
			$id    = $uid . '-' . $i;
			$name  = sanitize_key( str_replace( ' ', '-', strtolower( $f['label'] ) ) );
			$type  = in_array( $f['type'], array( 'text', 'email', 'tel', 'url', 'select', 'textarea' ), true ) ? $f['type'] : 'text';
			$req   = 'yes' === strtolower( trim( $f['req'] ) );
			$full  = 'yes' === strtolower( trim( $f['full'] ) );
			$labels[ $name ] = $f['label'];
			$ac    = isset( $auto[ $name ] ) ? ' autocomplete="' . esc_attr( $auto[ $name ] ) . '"' : '';
			$attrs = ' id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '"' . $ac . ' aria-describedby="' . esc_attr( $id ) . '-err"' . ( $req ? ' required aria-required="true"' : '' );
			echo '<div class="field' . ( $full ? ' field--full' : '' ) . '">';
			echo '<label class="field__label" for="' . esc_attr( $id ) . '">' . esc_html( $f['label'] ) . ( $req ? '<span class="req" aria-hidden="true">*</span>' : ' <span class="opt">(' . esc_html__( 'optional', 'afsv-vrc-core' ) . ')</span>' ) . '</label>';
			if ( 'select' === $type ) {
				echo '<select' . $attrs . '><option value="">' . esc_html__( 'Please select', 'afsv-vrc-core' ) . '</option>'; // phpcs:ignore
				foreach ( $this->lines( $f['options'] ) as $o ) {
					echo '<option value="' . esc_attr( $o ) . '">' . esc_html( $o ) . '</option>';
				}
				echo '</select>';
			} elseif ( 'textarea' === $type ) {
				echo '<textarea' . $attrs . ' rows="4"></textarea>'; // phpcs:ignore
			} else {
				echo '<input type="' . esc_attr( $type ) . '"' . $attrs . '>'; // phpcs:ignore
			}
			echo '<span class="field__error" id="' . esc_attr( $id ) . '-err" aria-live="polite"></span></div>';
		}
		$fields_html = ob_get_clean();
		$cid         = $uid . '-consent';
		$endpoint    = 'yes' === $s['send'] ? ' data-endpoint="' . esc_url( afsv_core_form_endpoint( $s['form_id'] ) ) . '"' : '';
		?>
<section class="wrap section" id="<?php echo esc_attr( $s['anchor'] ); ?>">
	<div class="split split--form">
		<div class="form-intro reveal">
			<h2 class="h2"><?php echo esc_html( $s['title'] ); ?></h2>
			<p class="body-lg"><?php echo esc_html( $s['lead'] ); ?></p>
			<?php if ( $s['note'] ) : ?><p class="small muted"><?php echo esc_html( $s['note'] ); ?></p><?php endif; ?>
		</div>
		<form class="form" data-preview-form<?php echo $endpoint; // phpcs:ignore ?>>
			<p class="small muted"><?php esc_html_e( 'Fields marked', 'afsv-vrc-core' ); ?> <span aria-hidden="true" style="color:var(--danger)">*</span><span class="sr-only"><?php esc_html_e( 'with an asterisk', 'afsv-vrc-core' ); ?></span> <?php esc_html_e( 'are required.', 'afsv-vrc-core' ); ?></p>
			<div class="form__grid"><?php echo $fields_html; // phpcs:ignore ?></div>
			<?php if ( $s['consent'] ) : ?>
			<label class="check" for="<?php echo esc_attr( $cid ); ?>"><input type="checkbox" id="<?php echo esc_attr( $cid ); ?>" name="consent" value="yes"<?php echo 'yes' === $s['consent_req'] ? ' required aria-describedby="' . esc_attr( $cid ) . '-err"' : ''; ?>><span><?php echo esc_html( $s['consent'] ); ?><span class="field__error" id="<?php echo esc_attr( $cid ); ?>-err"></span></span></label>
			<?php endif; ?>
			<div class="sr-only" aria-hidden="true"><label for="<?php echo esc_attr( $uid ); ?>-hp">Website</label><input type="text" id="<?php echo esc_attr( $uid ); ?>-hp" name="afsv_website" tabindex="-1" autocomplete="off"></div>
			<input type="hidden" name="afsv_labels" value="<?php echo esc_attr( wp_json_encode( $labels ) ); ?>">
			<div class="form-status" role="status" tabindex="-1" hidden><strong><?php esc_html_e( 'Thank you.', 'afsv-vrc-core' ); ?></strong> <?php echo esc_html( $s['success'] ); ?></div>
			<div class="form-status form-error" role="alert" tabindex="-1" hidden><strong><?php esc_html_e( 'Sorry, that did not send.', 'afsv-vrc-core' ); ?></strong> <?php esc_html_e( 'Please try again in a moment, or use the contact page.', 'afsv-vrc-core' ); ?></div>
			<div><button type="submit" class="btn btn--navy"><?php echo esc_html( $s['submit'] ); ?><?php echo afsv_arrow(); // phpcs:ignore ?></button></div>
		</form>
	</div>
</section>
		<?php
	}
}
