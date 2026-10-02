<?php
/**
 * Site masthead: announcement bar, header with dropdown navigation, mobile drawer.
 * Rendered directly by header.php, or by the "AFSV Site Header" Elementor widget
 * (which passes its controls in $args).
 *
 * @package AFSV_VRC
 */

defined( 'ABSPATH' ) || exit;

$a = wp_parse_args(
	isset( $args ) ? $args : array(),
	array(
		'overlay'       => afsv_header_overlay(),
		'show_announce' => true,
		'announce'      => __( 'AFSV VRC is in active development. Facilities, programs and partnerships shown as proposed or planned are future-state concepts and are not yet operational.', 'afsv-vrc' ),
		'nav'           => null,
		'menu'          => 0,
		'book_label'    => __( 'Book Now', 'afsv-vrc' ),
		'book_url'      => AFSV_BOOKING_URL,
		'contact_label' => __( 'Contact', 'afsv-vrc' ),
		'contact_url'   => '/contact',
		'logo_dark'     => afsv_logo( 'dark' ),
		'logo_light'    => afsv_logo( 'light' ),
	)
);

$nav     = is_array( $a['nav'] ) ? $a['nav'] : afsv_nav_tree( 'afsv-primary', $a['menu'] );
$overlay = (bool) $a['overlay'];
$name    = get_bloginfo( 'name' );
$legal   = __( 'AFSV VRC Global Development Group Ltd.', 'afsv-vrc' );
?>
<?php if ( $overlay ) : ?><div class="masthead masthead--overlay"><?php endif; ?>

<?php if ( $a['show_announce'] && $a['announce'] ) : ?>
<div class="announce" role="region" aria-label="<?php esc_attr_e( 'Site notice', 'afsv-vrc' ); ?>">
	<div class="wrap announce__inner">
		<p><?php echo esc_html( $a['announce'] ); ?></p>
		<button type="button" class="announce__close"><?php esc_html_e( 'Dismiss', 'afsv-vrc' ); ?><span class="sr-only"> <?php esc_html_e( 'site notice', 'afsv-vrc' ); ?></span></button>
	</div>
</div>
<?php endif; ?>

<header class="site-header<?php echo $overlay ? ' site-header--overlay' : ''; ?>"<?php echo $overlay ? ' data-overlay' : ''; ?>>
	<div class="wrap site-header__inner">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( sprintf( /* translators: site name */ __( '%s home', 'afsv-vrc' ), $name ) ); ?>">
			<img class="brand__dark" src="<?php echo esc_url( $a['logo_dark'] ); ?>" alt="<?php echo esc_attr( $legal ); ?>" width="600" height="160">
			<?php if ( $overlay ) : ?><img class="brand__light" src="<?php echo esc_url( $a['logo_light'] ); ?>" alt="" width="600" height="160"><?php endif; ?>
		</a>
		<nav class="primary-nav" aria-label="<?php esc_attr_e( 'Primary', 'afsv-vrc' ); ?>">
			<ul>
			<?php foreach ( $nav as $i => $item ) : ?>
				<?php if ( empty( $item['kids'] ) ) : ?>
				<li class="nav-item"><a class="nav-link" href="<?php echo esc_url( afsv_url( $item['href'] ) ); ?>"<?php echo afsv_is_current( $item['href'] ) ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $item['label'] ); ?></a></li>
				<?php else :
					$active = false;
					foreach ( $item['kids'] as $kid ) {
						$active = $active || afsv_is_current( $kid['href'] );
					}
					?>
				<li class="nav-item has-dropdown<?php echo $active ? ' is-current' : ''; ?>">
					<button type="button" class="nav-link" aria-expanded="false" aria-controls="menu-<?php echo (int) $i; ?>"><?php echo esc_html( $item['label'] ); ?><span class="caret" aria-hidden="true">▼</span></button>
					<ul class="dropdown" id="menu-<?php echo (int) $i; ?>">
						<?php foreach ( $item['kids'] as $kid ) : ?>
						<li><a href="<?php echo esc_url( afsv_url( $kid['href'] ) ); ?>"<?php echo afsv_is_current( $kid['href'] ) ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $kid['label'] ); ?></a></li>
						<?php endforeach; ?>
					</ul>
				</li>
				<?php endif; ?>
			<?php endforeach; ?>
			</ul>
		</nav>
		<button type="button" class="menu-toggle" data-drawer-open aria-controls="site-drawer" aria-expanded="false">
			<span class="burger" aria-hidden="true"><span></span><span></span><span></span></span><?php esc_html_e( 'Menu', 'afsv-vrc' ); ?>
		</button>
	</div>
</header>

<?php if ( $overlay ) : ?></div><?php endif; ?>

<?php if ( function_exists( 'is_woocommerce' ) && ( is_woocommerce() || is_cart() || is_checkout() ) ) : ?>
<div class="market-bar">
	<div class="wrap market-bar__inner">
		<div class="market-bar__title"><?php esc_html_e( 'Marketplace', 'afsv-vrc' ); ?></div>
		<nav aria-label="<?php esc_attr_e( 'Marketplace', 'afsv-vrc' ); ?>">
			<a href="<?php echo esc_url( afsv_url( '/marketplace' ) ); ?>"><?php esc_html_e( 'Overview', 'afsv-vrc' ); ?></a>
			<a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>"<?php echo is_shop() || is_product() ? ' aria-current="page"' : ''; ?>><?php esc_html_e( 'Shop All', 'afsv-vrc' ); ?></a>
			<a href="<?php echo esc_url( wc_get_cart_url() ); ?>"<?php echo is_cart() ? ' aria-current="page"' : ''; ?>><?php esc_html_e( 'Cart', 'afsv-vrc' ); ?></a>
		</nav>
		<div class="market-bar__actions">
			<a class="btn btn--line-light btn--sm market-bar__sell" href="<?php echo esc_url( afsv_url( '/marketplace#vendor-form' ) ); ?>"><?php esc_html_e( 'Sell with us', 'afsv-vrc' ); ?></a>
			<?php $count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0; ?>
			<a class="btn btn--gold btn--sm" href="<?php echo esc_url( wc_get_cart_url() ); ?>" aria-label="<?php echo esc_attr( sprintf( /* translators: %d items */ _n( 'View cart, %d item', 'View cart, %d items', $count, 'afsv-vrc' ), $count ) ); ?>"><?php esc_html_e( 'Cart', 'afsv-vrc' ); ?><span class="cart-count"><?php echo (int) $count; ?></span></a>
		</div>
	</div>
</div>
<?php endif; ?>

<div class="drawer" id="site-drawer" hidden>
	<button type="button" class="drawer__scrim" data-drawer-close tabindex="-1" aria-label="<?php esc_attr_e( 'Close menu', 'afsv-vrc' ); ?>"></button>
	<div class="drawer__panel" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Site menu', 'afsv-vrc' ); ?>">
		<div class="drawer__head">
			<img src="<?php echo esc_url( $a['logo_light'] ); ?>" alt="<?php echo esc_attr( $legal ); ?>" width="600" height="160">
			<button type="button" class="drawer__close" data-drawer-close aria-label="<?php esc_attr_e( 'Close menu', 'afsv-vrc' ); ?>">×</button>
		</div>
		<nav aria-label="<?php esc_attr_e( 'Site', 'afsv-vrc' ); ?>">
			<?php foreach ( $nav as $i => $item ) : ?>
				<?php if ( empty( $item['kids'] ) ) : ?>
				<div class="drawer__group"><a class="drawer__link" href="<?php echo esc_url( afsv_url( $item['href'] ) ); ?>"<?php echo afsv_is_current( $item['href'] ) ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $item['label'] ); ?></a></div>
				<?php else :
					$open = false;
					foreach ( $item['kids'] as $kid ) {
						$open = $open || afsv_is_current( $kid['href'] );
					}
					?>
				<div class="drawer__group">
					<button type="button" class="drawer__toggle" aria-expanded="<?php echo $open ? 'true' : 'false'; ?>" aria-controls="dsub-<?php echo (int) $i; ?>"><?php echo esc_html( $item['label'] ); ?><span class="plus" aria-hidden="true">+</span></button>
					<div class="drawer__sub" id="dsub-<?php echo (int) $i; ?>"<?php echo $open ? '' : ' hidden'; ?>>
						<?php foreach ( $item['kids'] as $kid ) : ?>
						<a href="<?php echo esc_url( afsv_url( $kid['href'] ) ); ?>"<?php echo afsv_is_current( $kid['href'] ) ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $kid['label'] ); ?></a>
						<?php endforeach; ?>
					</div>
				</div>
				<?php endif; ?>
			<?php endforeach; ?>
			<div class="drawer__ctas">
				<?php echo afsv_btn( $a['book_label'], $a['book_url'], 'gold' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
				<a class="btn btn--line-light" href="<?php echo esc_url( afsv_url( $a['contact_url'] ) ); ?>"><?php echo esc_html( $a['contact_label'] ); ?></a>
			</div>
		</nav>
	</div>
</div>
