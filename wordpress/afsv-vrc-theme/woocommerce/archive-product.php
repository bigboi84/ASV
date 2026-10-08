<?php
/**
 * The shop (and product category archives) as "The Collection".
 *
 * @package AFSV_VRC
 */

defined( 'ABSPATH' ) || exit;

get_header();
$products = afsv_collection_products();
$counts   = array();
foreach ( $products as $p ) {
	$t = afsv_product_collection( $p->get_id() );
	if ( $t ) {
		$counts[ $t->slug ] = ( isset( $counts[ $t->slug ] ) ? $counts[ $t->slug ] : 0 ) + 1;
	}
}
$active = is_product_category() ? get_queried_object()->slug : 'all';
echo afsv_shop_breadcrumb( array( array( 'Marketplace', home_url( '/marketplace/' ) ), array( 'The Collection', '' ) ) ); // phpcs:ignore
?>
<section class="wrap page-head" data-el="shop.header">
  <p class="eyebrow">The AFSV VRC Collection</p>
  <h1 class="h1 split-words" aria-label="The Collection."><span aria-hidden="true"><span class="w"><span style="--i:0">The</span></span> <span class="w"><span style="--i:1">Collection.</span></span></span></h1>
  <p class="lead measure"><?php echo esc_html( count( $products ) . ' pieces across four collections. ' . AFSV_CONCEPT_NOTE ); ?></p>
</section>
<section class="wrap section section--flush-top" data-el="shop.grid" data-merch>
  <div class="mk-filter" role="group" aria-label="Filter by collection">
    <button type="button" class="mk-chip" data-filter="all" aria-pressed="<?php echo 'all' === $active ? 'true' : 'false'; ?>">All <span><?php echo count( $products ); ?></span></button>
	<?php
	foreach ( AFSV_COLLECTIONS as $slug ) :
		$term = get_term_by( 'slug', $slug, 'product_cat' );
		if ( ! $term || empty( $counts[ $slug ] ) ) {
			continue;
		}
		?>
    <button type="button" class="mk-chip" data-filter="<?php echo esc_attr( $slug ); ?>" aria-pressed="<?php echo $slug === $active ? 'true' : 'false'; ?>"><?php echo esc_html( $term->name ); ?> <span><?php echo (int) $counts[ $slug ]; ?></span></button>
	<?php endforeach; ?>
  </div>
  <p class="sr-only" aria-live="polite" data-merch-status></p>
  <div class="merch-grid">
	<?php
	foreach ( $products as $p ) {
		echo afsv_merch_card( $p, 'h2' ); // phpcs:ignore
	}
	?>
  </div>
</section>
<?php
afsv_shop_part( 'coming' );
afsv_shop_part( 'launch-form' );
get_footer();
