<?php
/**
 * A product as the concept product page: studio image with the on-model photo and clip on hover,
 * colour swatches, concept specs and "Keep up to date" (no price, no Add to cart).
 *
 * @package AFSV_VRC
 */

defined( 'ABSPATH' ) || exit;

get_header();
while ( have_posts() ) :
	the_post();
	$product = wc_get_product( get_the_ID() );
	$term    = afsv_product_collection( $product->get_id() );
	$line    = afsv_line_of( $term );
	$colours = afsv_product_colours( $product );
	$first   = $colours[0];
	$name    = $product->get_name();
	$desc    = wp_strip_all_tags( $product->get_short_description() ? $product->get_short_description() : $product->get_description() );
	$stage   = $first['img'] ? afsv_merch_img( $first['img'] ) : wp_get_attachment_image_url( $product->get_image_id(), 'large' );
	echo afsv_shop_breadcrumb( array( array( 'Marketplace', home_url( '/marketplace/' ) ), array( 'The Collection', get_permalink( wc_get_page_id( 'shop' ) ) ), array( $name, '' ) ) ); // phpcs:ignore
	?>
<section class="wrap section section--flush-top mk-product" data-el="product.main" data-merch-product>
  <div class="mk-product__gallery">
    <figure class="mk-product__stage">
      <img src="<?php echo esc_url( $stage ); ?>" alt="<?php echo esc_attr( $name . ( $first['name'] ? ' in ' . strtolower( $first['name'] ) : '' ) . ' — concept image' ); ?>" width="960" height="1200" fetchpriority="high" data-stage>
	<?php if ( $first['img'] ) : ?>
      <img class="mk-product__model" src="<?php echo esc_url( afsv_merch_model( $first['img'] ) ); ?>" alt="" width="960" height="1200" data-model-stage>
      <video class="mk-product__model mk-product__vid" muted loop playsinline preload="none" poster="<?php echo esc_url( afsv_merch_model( $first['img'] ) ); ?>" data-vbase="<?php echo esc_url( afsv_merch_clip( $first['img'] ) ); ?>" data-model-video aria-hidden="true"></video>
      <span class="merch-card__hint" aria-hidden="true">Hover to see it worn</span>
	<?php endif; ?>
    </figure>
	<?php if ( count( $colours ) > 1 ) : ?>
    <div class="mk-product__thumbs" aria-hidden="true">
		<?php foreach ( $colours as $i => $c ) : ?>
      <span class="<?php echo 0 === $i ? 'is-on' : ''; ?>" data-thumb="<?php echo (int) $i; ?>"><img src="<?php echo esc_url( afsv_merch_img( $c['img'] ) ); ?>" alt="" width="960" height="1200" loading="lazy"></span>
		<?php endforeach; ?>
    </div>
	<?php endif; ?>
  </div>
  <div class="mk-product__info">
    <p class="eyebrow"><?php echo esc_html( $term ? $term->name : '' ); ?></p>
    <h1 class="mk-product__name"><?php echo esc_html( $name ); ?></h1>
    <p class="mk-product__status"><span class="pill pill--gold"><?php echo esc_html( AFSV_CONCEPT ); ?></span></p>
    <p class="lead"><?php echo esc_html( $desc ); ?></p>
	<?php if ( $first['name'] ) : ?>
    <fieldset class="mk-colours">
      <legend>Colour: <b data-colour-name><?php echo esc_html( $first['name'] ); ?></b></legend>
      <div class="mk-colours__row">
		<?php foreach ( $colours as $i => $c ) : ?>
        <button type="button" class="mk-colour" style="--sw:<?php echo esc_attr( $c['hex'] ); ?>" aria-pressed="<?php echo 0 === $i ? 'true' : 'false'; ?>" data-colour="<?php echo (int) $i; ?>" data-img="<?php echo esc_url( afsv_merch_img( $c['img'] ) ); ?>" data-model="<?php echo esc_url( afsv_merch_model( $c['img'] ) ); ?>" data-vbase="<?php echo esc_url( afsv_merch_clip( $c['img'] ) ); ?>" data-name="<?php echo esc_attr( $c['name'] ); ?>" data-alt="<?php echo esc_attr( $name . ' in ' . strtolower( $c['name'] ) . ' — concept image' ); ?>"><span class="sr-only"><?php echo esc_html( $c['name'] ); ?></span></button>
		<?php endforeach; ?>
      </div>
    </fieldset>
	<?php endif; ?>
    <dl class="mk-specs">
      <div><dt>Crest</dt><dd><?php echo 'executive' === $line ? 'Small gold crest' : 'Small colour crest (designer&#039;s artwork)'; ?></dd></div>
      <div><dt>Line</dt><dd><?php echo 'executive' === $line ? 'Executive' : 'Everyday &amp; Sport'; ?></dd></div>
      <div><dt>Sizes</dt><dd>To be confirmed</dd></div>
      <div><dt>Pricing</dt><dd>To be confirmed</dd></div>
    </dl>
    <div class="btn-row btn-row--stack">
		<?php echo afsv_shop_btn( 'Keep up to date on this piece', home_url( '/marketplace/#buyer-form' ), 'navy' ) . afsv_shop_btn( 'Back to the collection', get_permalink( wc_get_page_id( 'shop' ) ), 'line-dark' ); // phpcs:ignore ?>
    </div>
    <p class="small muted mt-m"><?php echo esc_html( AFSV_CONCEPT_NOTE ); ?> Front and back views, detail shots and a product video will be added for each piece.</p>
  </div>
</section>
	<?php
	// More from the same line: same collection first, then the rest of the line.
	$related = array();
	foreach ( afsv_collection_products() as $p ) {
		if ( $p->get_id() === $product->get_id() ) {
			continue;
		}
		$t = afsv_product_collection( $p->get_id() );
		if ( $t && $term && $t->slug === $term->slug ) {
			$related[] = $p;
		}
	}
	foreach ( afsv_collection_products() as $p ) {
		if ( $p->get_id() !== $product->get_id() && ! in_array( $p, $related, true ) && afsv_line_of( afsv_product_collection( $p->get_id() ) ) === $line ) {
			$related[] = $p;
		}
	}
	$related = array_slice( $related, 0, 4 );
	if ( $related ) :
		?>
<section class="band--cream" data-el="product.related">
  <div class="wrap section">
    <div class="section-head reveal"><h2 class="h2">More from the <?php echo 'executive' === $line ? 'Executive' : 'Everyday &amp; Sport'; ?> line.</h2></div>
    <div class="merch-grid">
		<?php
		foreach ( $related as $p ) {
			echo afsv_merch_card( $p ); // phpcs:ignore
		}
		?>
    </div>
  </div>
</section>
		<?php
	endif;
endwhile;
get_footer();
