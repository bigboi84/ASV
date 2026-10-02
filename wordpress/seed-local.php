<?php
/**
 * Local test: `wp eval-file wordpress/seed-local.php` runs the same importer as
 * Tools → AFSV VRC Setup (pages published, Home as front page).
 */
foreach ( afsv_core_run_import( array( 'status' => 'publish', 'front' => true ) ) as $line ) {
	echo $line . "\n";
}
