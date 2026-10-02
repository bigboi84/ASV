<?php
/**
 * Site footer. Rendered by footer.php or by the "AFSV Site Footer" Elementor widget.
 *
 * @package AFSV_VRC
 */

defined( 'ABSPATH' ) || exit;

$a = wp_parse_args(
	isset( $args ) ? $args : array(),
	array(
		'tagline'      => __( 'Building Athletes. Empowering Minds. Strengthening Communities.', 'afsv-vrc' ),
		'contact_text' => __( 'A public inquiry mailbox will be published once routing is confirmed. Until then, the contact form reaches the right team.', 'afsv-vrc' ),
		'contact_link' => __( 'Contact AFSV VRC', 'afsv-vrc' ),
		'contact_url'  => '/contact',
		'columns'      => null,
		'legal_note'   => __( 'Proposed and planned items are future-state and not yet operational.', 'afsv-vrc' ),
		'logo'         => afsv_logo( 'light' ),
	)
);
$cols  = is_array( $a['columns'] ) ? $a['columns'] : afsv_footer_columns();
$legal = __( 'AFSV VRC Global Development Group Ltd.', 'afsv-vrc' );

$legal_links = afsv_nav_tree( 'afsv-legal' );
if ( ! $legal_links ) {
	$legal_links = array(
		array( 'label' => __( 'Legal & policies', 'afsv-vrc' ), 'href' => '/legal' ),
		array( 'label' => __( 'Accessibility', 'afsv-vrc' ), 'href' => '/accessibility-privacy' ),
		array( 'label' => __( 'Report an issue', 'afsv-vrc' ), 'href' => '/accessibility-privacy#support' ),
	);
}
?>
<footer class="site-footer">
	<div class="wrap site-footer__grid">
		<div class="site-footer__brand">
			<img src="<?php echo esc_url( $a['logo'] ); ?>" alt="<?php echo esc_attr( $legal ); ?>" width="600" height="160" loading="lazy">
			<p class="site-footer__tag"><?php echo esc_html( $a['tagline'] ); ?></p>
			<div class="site-footer__contact">
				<p><?php echo esc_html( $a['contact_text'] ); ?></p>
				<a class="text-link text-link--light" href="<?php echo esc_url( afsv_url( $a['contact_url'] ) ); ?>"><?php echo esc_html( $a['contact_link'] ); ?> <?php echo afsv_arrow(); // phpcs:ignore WordPress.Security.EscapeOutput ?></a>
			</div>
		</div>
		<?php foreach ( $cols as $col ) : ?>
		<div>
			<h2><?php echo esc_html( $col['title'] ); ?></h2>
			<ul>
				<?php foreach ( $col['links'] as $link ) :
					$href = afsv_url( $link['href'] );
					$ext  = afsv_is_external( $href );
					?>
				<li><a href="<?php echo esc_url( $href ); ?>"<?php echo $ext ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>><?php echo esc_html( $link['label'] ); ?><?php echo $ext ? '<span class="sr-only"> ' . esc_html__( '(opens in a new tab)', 'afsv-vrc' ) . '</span>' : ''; ?></a></li>
				<?php endforeach; ?>
			</ul>
		</div>
		<?php endforeach; ?>
	</div>
	<div class="site-footer__bar">
		<div class="wrap">
			<p>© <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( $legal ); ?> <?php echo esc_html( $a['legal_note'] ); ?></p>
			<nav aria-label="<?php esc_attr_e( 'Legal', 'afsv-vrc' ); ?>">
				<?php foreach ( $legal_links as $link ) : ?>
				<a href="<?php echo esc_url( afsv_url( $link['href'] ) ); ?>"><?php echo esc_html( $link['label'] ); ?></a>
				<?php endforeach; ?>
			</nav>
		</div>
	</div>
</footer>
<button type="button" class="to-top" aria-label="<?php esc_attr_e( 'Back to top', 'afsv-vrc' ); ?>"><?php echo afsv_icon( 'up' ); // phpcs:ignore WordPress.Security.EscapeOutput ?></button>
