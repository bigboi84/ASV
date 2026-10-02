<?php
/**
 * Events: queries, view model and the featured event card.
 *
 * @package AFSV_VRC_Core
 */

defined( 'ABSPATH' ) || exit;

/**
 * Events ordered by start date. $scope: upcoming | past | all.
 *
 * @return WP_Post[]
 */
function afsv_core_get_events( $scope = 'upcoming', $limit = -1 ) {
	$args = array(
		'post_type'      => 'afsv_event',
		'post_status'    => 'publish',
		'posts_per_page' => $limit,
		'meta_key'       => 'afsv_start', // phpcs:ignore WordPress.DB.SlowDBQuery
		'orderby'        => 'meta_value',
		'order'          => 'past' === $scope ? 'DESC' : 'ASC',
	);
	if ( 'all' !== $scope ) {
		$args['meta_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery
			array(
				'key'     => 'afsv_start',
				'value'   => current_time( 'Y-m-d\TH:i' ),
				'compare' => 'past' === $scope ? '<' : '>=',
			),
		);
	}
	return get_posts( $args );
}

/** Flatten an event post into the fields the card needs. */
function afsv_core_event_view( $post ) {
	$post  = get_post( $post );
	$m     = function ( $k ) use ( $post ) {
		return (string) get_post_meta( $post->ID, $k, true );
	};
	$start = $m( 'afsv_start' );
	$tz    = $m( 'afsv_timezone' );
	$ts    = $start ? strtotime( $start ) : 0;
	return array(
		'id'            => $post->ID,
		'name'          => get_the_title( $post ),
		'summary'       => $post->post_excerpt ? $post->post_excerpt : wp_trim_words( wp_strip_all_tags( $post->post_content ), 60 ),
		'start_iso'     => $start ? $start . ( strlen( $start ) === 16 ? ':00' : '' ) . ( $tz ? $tz : '' ) : '',
		'day'           => $ts ? gmdate( 'j', $ts ) : '',
		'month'         => $ts ? gmdate( 'M', $ts ) : '',
		'date_label'    => $m( 'afsv_date_label' ) ? $m( 'afsv_date_label' ) : ( $ts ? gmdate( 'F j, Y', $ts ) : '' ),
		'end_label'     => $m( 'afsv_end_label' ),
		'venue'         => $m( 'afsv_venue' ),
		'city'          => $m( 'afsv_city' ),
		'url'           => $m( 'afsv_url' ) ? $m( 'afsv_url' ) : get_permalink( $post ),
		'brand'         => $m( 'afsv_brand' ),
		'headline'      => $m( 'afsv_headline' ),
		'subhead'       => $m( 'afsv_subhead' ),
		'themes'        => afsv_core_lines( $m( 'afsv_themes' ) ),
		'facts'         => afsv_core_lines( $m( 'afsv_facts' ), true ),
		'cta_primary'   => $m( 'afsv_cta_primary' ) ? $m( 'afsv_cta_primary' ) : __( 'Register', 'afsv-vrc-core' ),
		'cta_secondary' => $m( 'afsv_cta_secondary' ),
		'host'          => $m( 'afsv_host' ),
	);
}

/** Featured event card markup (same structure as the design build). */
function afsv_core_render_event( $e, $side_label = '' ) {
	$side_label = $side_label ? $side_label : __( 'Event opens in', 'afsv-vrc-core' );
	$ext        = afsv_is_external( $e['url'] );
	$target     = $ext ? ' target="_blank" rel="noopener noreferrer"' : '';
	$newtab     = $ext ? '<span class="sr-only"> ' . esc_html__( '(opens the event website in a new tab)', 'afsv-vrc-core' ) . '</span>' : '';
	ob_start();
	?>
<article class="event<?php echo $e['brand'] ? ' event--' . esc_attr( $e['brand'] ) : ''; ?>">
	<div class="event__date" aria-hidden="true">
		<span class="event__day"><?php echo esc_html( $e['day'] ); ?></span>
		<span class="event__month"><?php echo esc_html( $e['month'] ); ?></span>
		<span class="event__end"><?php echo esc_html( $e['end_label'] ); ?></span>
	</div>
	<div class="event__main">
		<p class="event__wordmark"><small><?php echo esc_html( trim( $e['city'] . ' · ' . $e['date_label'], ' ·' ) ); ?></small></p>
		<h3 class="event__title"><a href="<?php echo esc_url( $e['url'] ); ?>"<?php echo $target; // phpcs:ignore ?>><?php echo esc_html( $e['name'] ); ?><?php echo $newtab; // phpcs:ignore ?></a></h3>
		<?php if ( $e['headline'] || $e['subhead'] ) : ?>
		<p class="event__headline"><span><?php echo esc_html( $e['headline'] ); ?></span> <?php echo esc_html( $e['subhead'] ); ?></p>
		<?php endif; ?>
		<?php if ( $e['themes'] ) : ?>
		<ul class="event__themes"><?php foreach ( $e['themes'] as $t ) : ?><li><?php echo esc_html( $t ); ?></li><?php endforeach; ?></ul>
		<?php endif; ?>
		<p class="event__summary"><?php echo esc_html( $e['summary'] ); ?></p>
		<p class="event__where"><strong><?php echo esc_html( $e['date_label'] ); ?></strong><?php echo $e['venue'] || $e['city'] ? ' · ' . esc_html( trim( $e['venue'] . ', ' . $e['city'], ', ' ) ) : ''; ?></p>
		<div class="btn-row btn-row--stack">
			<a class="btn btn--gold event__cta" href="<?php echo esc_url( $e['url'] ); ?>"<?php echo $target; // phpcs:ignore ?>><?php echo esc_html( $e['cta_primary'] ); ?><?php echo $newtab; // phpcs:ignore ?><?php echo $ext ? afsv_icon( 'external' ) : afsv_arrow(); // phpcs:ignore ?></a>
			<?php if ( $e['cta_secondary'] ) : ?>
			<a class="btn btn--line-light event__cta2" href="<?php echo esc_url( $e['url'] ); ?>"<?php echo $target; // phpcs:ignore ?>><?php echo esc_html( $e['cta_secondary'] ); ?><?php echo $newtab; // phpcs:ignore ?><?php echo $ext ? afsv_icon( 'external' ) : afsv_arrow(); // phpcs:ignore ?></a>
			<?php endif; ?>
		</div>
		<?php if ( $e['host'] ) : ?><p class="event__host"><?php echo esc_html( $e['host'] ); ?></p><?php endif; ?>
	</div>
	<aside class="event__side">
		<?php if ( $e['start_iso'] ) : ?>
		<p class="event__side-label"><?php echo esc_html( $side_label ); ?></p>
		<div class="countdown" data-countdown="<?php echo esc_attr( $e['start_iso'] ); ?>" role="timer" aria-label="<?php echo esc_attr( sprintf( /* translators: event name */ __( 'Countdown to %s', 'afsv-vrc-core' ), $e['name'] ) ); ?>">
			<?php foreach ( array( 'days' => __( 'Days', 'afsv-vrc-core' ), 'hours' => __( 'Hours', 'afsv-vrc-core' ), 'mins' => __( 'Minutes', 'afsv-vrc-core' ), 'secs' => __( 'Seconds', 'afsv-vrc-core' ) ) as $unit => $label ) : ?>
			<div class="countdown__cell"><span class="countdown__num" data-unit="<?php echo esc_attr( $unit ); ?>">--</span><span class="countdown__label"><?php echo esc_html( $label ); ?></span></div>
			<?php endforeach; ?>
		</div>
		<?php endif; ?>
		<?php if ( $e['facts'] ) : ?>
		<dl class="event__facts"><?php foreach ( $e['facts'] as $f ) : ?><div><dt><?php echo esc_html( $f[0] ); ?></dt><dd><?php echo esc_html( $f[1] ); ?></dd></div><?php endforeach; ?></dl>
		<?php endif; ?>
	</aside>
</article>
	<?php
	return ob_get_clean();
}

/* Footer: the "Events" column lists upcoming events automatically. */
add_filter( 'afsv_footer_columns', function ( $cols ) {
	$events = afsv_core_get_events( 'upcoming', 3 );
	if ( ! $events ) {
		return $cols;
	}
	$links = array();
	foreach ( $events as $ev ) {
		$links[] = array(
			'label' => get_the_title( $ev ),
			'href'  => afsv_url( '/events' ),
		);
		$site = get_post_meta( $ev->ID, 'afsv_url', true );
		if ( $site && 1 === count( $events ) ) {
			$links[] = array(
				'label' => __( 'Summit website', 'afsv-vrc-core' ),
				'href'  => $site,
			);
		}
	}
	$links[] = array(
		'label' => __( 'All events', 'afsv-vrc-core' ),
		'href'  => afsv_url( '/events' ),
	);
	foreach ( $cols as $i => $col ) {
		if ( 0 === strcasecmp( $col['title'], 'Events' ) ) {
			$cols[ $i ]['links'] = $links;
			return $cols;
		}
	}
	array_splice( $cols, 2, 0, array( array( 'title' => __( 'Events', 'afsv-vrc-core' ), 'links' => $links ) ) );
	return $cols;
} );
