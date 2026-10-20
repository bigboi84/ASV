<?php
/**
 * Removes the plugin's settings and cached release data.
 *
 * @package GH_Release_Updater
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

global $wpdb;
delete_option( 'ghru_sources' );
// Cached releases (site transients are stored as options on single sites).
$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '\\_site\\_transient\\_ghru\\_%' OR option_name LIKE '\\_site\\_transient\\_timeout\\_ghru\\_%'" ); // phpcs:ignore WordPress.DB
