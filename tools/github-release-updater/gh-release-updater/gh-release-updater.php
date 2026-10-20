<?php
/**
 * Plugin Name:       GitHub Release Updater
 * Description:       One-click updates for your own plugins and themes from GitHub releases or from the live files of a branch (public or private repositories). Add a repository under Settings → GitHub Updates.
 * Version:           1.2.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            bigboi84
 * License:           GPL-2.0-or-later
 * Text Domain:       gh-release-updater
 *
 * @package GH_Release_Updater
 */

defined( 'ABSPATH' ) || exit;

define( 'GHRU_VERSION', '1.2.0' );
define( 'GHRU_FILE', __FILE__ );

register_deactivation_hook( __FILE__, function () {
	wp_clear_scheduled_hook( 'ghru_cron' );
} );

require_once __DIR__ . '/includes/core.php';
require_once __DIR__ . '/includes/admin.php';
