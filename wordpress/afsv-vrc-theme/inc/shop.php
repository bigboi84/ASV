<?php
/**
 * WooCommerce in the AFSV VRC design: the shop is "The Collection" and every product page is the
 * concept product page (studio image, on-model photo and hover video, colour swatches, no price,
 * "Keep up to date" instead of Add to cart).
 *
 * Product data:
 *   - categories (product_cat) are the four collections; slugs starting "executive" are the Executive line
 *   - short description is the product line under the name
 *   - meta "afsv_colours" is JSON: [{ "name": "Navy", "hex": "#1B2A4A", "img": "regular-hoodie-navy.jpg" }, …]
 *     where img is a file in the theme's assets/img/merch/ (on-model photo and clip share its name)
 *
 * @package AFSV_VRC
 */

defined( 'ABSPATH' ) || exit;

const AFSV_CONCEPT      = 'Concept — pending approval';
const AFSV_CONCEPT_NOTE = 'Concept visualisations for executive review. Final crest artwork, colours, sizing, pricing and product details are subject to approval.';
const AFSV_COLLECTIONS  = array( 'executive-apparel', 'executive-accessories', 'everyday-apparel', 'everyday-accessories' );

function afsv_merch_img( $f ) {
	return afsv_asset( 'img/merch/' . $f );
}
function afsv_merch_model( $f ) {
	return afsv_asset( 'img/merch/on-model/' . $f );
}
function afsv_merch_clip( $f ) {
	return afsv_asset( 'video/on-model/' . preg_replace( '/\.jpg$/', '', $f ) );
}

/** The product's collection term (first product_cat that is one of the four collections). */
function afsv_product_collection( $product_id ) {
	$terms = get_the_terms( $product_id, 'product_cat' );
	if ( $terms && ! is_wp_error( $terms ) ) {
		foreach ( $terms as $t ) {
			if ( in_array( $t->slug, AFSV_COLLECTIONS, true ) ) {
				return $t;
			}
		}
		return $terms[0];
	}
	return null;
}
function afsv_line_of( $term ) {
	return ( $term && 0 === strpos( $term->slug, 'executive' ) ) ? 'executive' : 'everyday';
}

/** Colours for a product; falls back to its featured image. */
function afsv_product_colours( $product ) {
	$raw = json_decode( (string) $product->get_meta( 'afsv_colours' ), true );
	if ( is_array( $raw ) && $raw ) {
		return $raw;
	}
	return array( array( 'name' => '', 'hex' => '#ddd', 'img' => '' ) );
}

function afsv_arrow() {
	return '<span class="arrow" aria-hidden="true"><svg class="icon " width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/></svg></span>';
}
function afsv_btn( $label, $url, $variant = 'navy' ) {
	return sprintf( '<a class="btn btn--%s" href="%s">%s%s</a>', esc_attr( $variant ), esc_url( $url ), esc_html( $label ), afsv_arrow() );
}
function afsv_breadcrumb( $trail ) {
	$items = array_merge( array( array( __( 'Home', 'afsv-vrc' ), home_url( '/' ) ) ), $trail );
	$out   = array();
	foreach ( $items as $i => $it ) {
		$last  = count( $items ) - 1 === $i;
		$out[] = $last ? '<li aria-current="page">' . esc_html( $it[0] ) . '</li>' : '<li><a href="' . esc_url( $it[1] ) . '">' . esc_html( $it[0] ) . '</a></li><li aria-hidden="true">/</li>';
	}
	return '<nav class="breadcrumb wrap" aria-label="Breadcrumb"><ol>' . implode( '', $out ) . '</ol></nav>';
}

/** Product card: studio image, on-model photo + clip on hover, name, colour dots. */
function afsv_merch_card( $product, $tag = 'h3' ) {
	$term    = afsv_product_collection( $product->get_id() );
	$line    = afsv_line_of( $term );
	$colours = afsv_product_colours( $product );
	$a       = $colours[0];
	$name    = $product->get_name();
	$img     = $a['img'] ? afsv_merch_img( $a['img'] ) : wp_get_attachment_image_url( $product->get_image_id(), 'large' );
	ob_start();
	?>
<a class="merch-card merch-card--<?php echo esc_attr( $line ); ?>" href="<?php echo esc_url( $product->get_permalink() ); ?>" data-collection="<?php echo esc_attr( $term ? $term->slug : '' ); ?>">
  <span class="merch-card__media">
    <img src="<?php echo esc_url( $img ); ?>" alt="<?php echo esc_attr( $name . ( $a['name'] ? ' in ' . strtolower( $a['name'] ) : '' ) . ' — concept image' ); ?>" width="960" height="1200" loading="lazy">
	<?php if ( $a['img'] ) : ?>
    <img class="merch-card__alt" src="<?php echo esc_url( afsv_merch_model( $a['img'] ) ); ?>" alt="" width="960" height="1200" loading="lazy">
    <video class="merch-card__vid" muted loop playsinline preload="none" poster="<?php echo esc_url( afsv_merch_model( $a['img'] ) ); ?>" data-vbase="<?php echo esc_url( afsv_merch_clip( $a['img'] ) ); ?>" aria-hidden="true"></video>
    <span class="merch-card__hint" aria-hidden="true">On model</span>
	<?php endif; ?>
    <span class="merch-card__tag">Concept</span>
  </span>
  <span class="merch-card__body">
    <span class="merch-card__line"><?php echo 'executive' === $line ? 'Executive · Gold crest' : 'Everyday &amp; Sport · Colour crest'; ?></span>
    <<?php echo tag_escape( $tag ); ?> class="merch-card__name"><?php echo esc_html( $name ); ?></<?php echo tag_escape( $tag ); ?>>
    <span class="merch-card__swatches" aria-label="<?php echo esc_attr( 'Colours: ' . implode( ', ', wp_list_pluck( $colours, 'name' ) ) ); ?>">
	<?php foreach ( $colours as $c ) : ?>
      <span class="swatch" style="--sw:<?php echo esc_attr( $c['hex'] ); ?>" title="<?php echo esc_attr( $c['name'] ); ?>"></span>
	<?php endforeach; ?>
      <span class="merch-card__count"><?php echo esc_html( count( $colours ) > 1 ? count( $colours ) . ' colours' : $colours[0]['name'] ); ?></span>
    </span>
  </span>
</a>
	<?php
	return ob_get_clean();
}

/** Published products in collection order. */
function afsv_collection_products( $args = array() ) {
	$products = wc_get_products( array_merge( array( 'status' => 'publish', 'limit' => -1, 'orderby' => 'menu_order', 'order' => 'ASC' ), $args ) );
	usort(
		$products,
		function ( $a, $b ) {
			$ta = afsv_product_collection( $a->get_id() );
			$tb = afsv_product_collection( $b->get_id() );
			$ia = $ta ? array_search( $ta->slug, AFSV_COLLECTIONS, true ) : 9;
			$ib = $tb ? array_search( $tb->slug, AFSV_COLLECTIONS, true ) : 9;
			return ( $ia === $ib ) ? $a->get_menu_order() - $b->get_menu_order() : $ia - $ib;
		}
	);
	return $products;
}

/** A design section shipped with the theme (generated from the design build). */
function afsv_part( $name ) {
	$file = get_stylesheet_directory() . '/chrome/part-' . $name . '.html';
	if ( file_exists( $file ) ) {
		echo afsv_fill( file_get_contents( $file ) ); // phpcs:ignore -- generated design markup.
	}
}

/* Concept stage: no prices, no Add to cart anywhere. */
add_filter( 'woocommerce_is_purchasable', '__return_false' );
add_filter( 'woocommerce_get_price_html', '__return_empty_string' );
