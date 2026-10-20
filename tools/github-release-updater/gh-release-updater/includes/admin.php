<?php
/**
 * Settings → GitHub Updates.
 *
 * @package GH_Release_Updater
 */

defined( 'ABSPATH' ) || exit;

add_action( 'admin_menu', function () {
	add_options_page( __( 'GitHub Updates', 'gh-release-updater' ), __( 'GitHub Updates', 'gh-release-updater' ), 'update_plugins', 'ghru', 'ghru_screen' );
} );

add_filter( 'plugin_action_links_' . plugin_basename( GHRU_FILE ), function ( $links ) {
	array_unshift( $links, '<a href="' . esc_url( admin_url( 'options-general.php?page=ghru' ) ) . '">' . esc_html__( 'Settings', 'gh-release-updater' ) . '</a>' );
	return $links;
} );

/** Installed plugins and themes as "plugin|folder/file.php" / "theme|folder" => label. */
function ghru_installed_items() {
	if ( ! function_exists( 'get_plugins' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	$out = array();
	foreach ( get_plugins() as $file => $p ) {
		$out[ 'plugin|' . $file ] = sprintf( /* translators: 1: name 2: version */ __( 'Plugin: %1$s (%2$s)', 'gh-release-updater' ), $p['Name'], $p['Version'] );
	}
	foreach ( wp_get_themes() as $slug => $t ) {
		$out[ 'theme|' . $slug ] = sprintf( __( 'Theme: %1$s (%2$s)', 'gh-release-updater' ), $t->get( 'Name' ), $t->get( 'Version' ) );
	}
	return $out;
}

/** Cleans the submitted rows; a row with no repository is dropped. A blank token keeps the one already saved. */
function ghru_clean_rows( $rows, $old ) {
	$items = ghru_installed_items();
	$out   = array();
	foreach ( is_array( $rows ) ? $rows : array() as $r ) {
		$item = isset( $r['item'] ) ? sanitize_text_field( $r['item'] ) : '';
		$repo = isset( $r['repo'] ) ? trim( sanitize_text_field( $r['repo'] ) ) : '';
		$repo = preg_replace( '#^https?://github\.com/#i', '', rtrim( $repo, '/' ) );
		$repo = preg_replace( '#\.git$#', '', $repo );
		if ( '' === $repo || ! isset( $items[ $item ] ) || ! ghru_valid_repo( $repo ) ) {
			continue;
		}
		$mode   = isset( $r['mode'] ) && 'branch' === $r['mode'] ? 'branch' : 'release';
		$branch = isset( $r['branch'] ) ? trim( sanitize_text_field( $r['branch'] ) ) : '';
		$path   = isset( $r['path'] ) ? trim( sanitize_text_field( $r['path'] ), " \t\n\r/" ) : '';
		if ( ! ghru_branch_ok( $branch ) || ! ghru_path_ok( $path ) ) {
			continue;
		}
		$tok = isset( $r['token'] ) ? trim( sanitize_text_field( $r['token'] ) ) : '';
		if ( '' === $tok && empty( $r['clear_token'] ) ) {
			foreach ( $old as $o ) {
				if ( isset( $o['item'], $o['repo'], $o['token'] ) && $o['item'] === $item && $o['repo'] === $repo ) {
					$tok = $o['token'];
				}
			}
		}
		$out[] = array(
			'item'   => $item,
			'repo'   => $repo,
			'mode'   => $mode,
			'asset'  => isset( $r['asset'] ) ? sanitize_file_name( $r['asset'] ) : '',
			'branch' => $branch,
			'path'   => $path,
			'token'  => $tok,
			'auto'   => ! empty( $r['auto'] ) ? 1 : 0,
		);
	}
	return $out;
}

/** WordPress's own auto-update lists: add or remove the item so the core automatic updater handles it. */
function ghru_apply_auto( $rows ) {
	foreach ( $rows as $r ) {
		list( $type, $id ) = ghru_item_parts( $r );
		$opt               = 'plugin' === $type ? 'auto_update_plugins' : 'auto_update_themes';
		$list              = (array) get_site_option( $opt, array() );
		$list              = array_values( array_diff( $list, array( $id ) ) );
		if ( ! empty( $r['auto'] ) ) {
			$list[] = $id;
		}
		update_site_option( $opt, array_values( array_unique( $list ) ) );
	}
}

function ghru_is_auto( $src ) {
	list( $type, $id ) = ghru_item_parts( $src );
	$opt               = 'plugin' === $type ? 'auto_update_plugins' : 'auto_update_themes';
	return in_array( $id, (array) get_site_option( $opt, array() ), true );
}

function ghru_update_link( $src ) {
	list( $type, $id ) = ghru_item_parts( $src );
	if ( 'plugin' === $type ) {
		return wp_nonce_url( self_admin_url( 'update.php?action=upgrade-plugin&plugin=' . rawurlencode( $id ) ), 'upgrade-plugin_' . $id );
	}
	return wp_nonce_url( self_admin_url( 'update.php?action=upgrade-theme&theme=' . rawurlencode( $id ) ), 'upgrade-theme_' . $id );
}

function ghru_screen() {
	if ( ! current_user_can( 'update_plugins' ) ) {
		return;
	}
	$msg = '';
	if ( isset( $_POST['ghru_nonce'] ) && wp_verify_nonce( sanitize_key( $_POST['ghru_nonce'] ), 'ghru_save' ) ) {
		$rows = ghru_clean_rows( isset( $_POST['src'] ) ? wp_unslash( $_POST['src'] ) : array(), ghru_sources() ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		update_option( 'ghru_sources', $rows, false );
		ghru_apply_auto( $rows );
		// A fresh look-up, then let WordPress rebuild its update lists.
		foreach ( $rows as $r ) {
			delete_site_transient( 'ghru_' . md5( $r['repo'] . '|' . ghru_token( $r ) ) );
			delete_site_transient( 'ghru_br_' . md5( ghru_src_key( $r ) . '|' . ghru_token( $r ) ) );
		}
		delete_site_transient( 'update_plugins' );
		delete_site_transient( 'update_themes' );
		wp_update_plugins();
		wp_update_themes();
		$msg = __( 'Saved, and GitHub checked.', 'gh-release-updater' );
	}
	$sources   = ghru_sources();
	$items     = ghru_installed_items();
	$sources[] = array( 'item' => '', 'repo' => '', 'mode' => 'release', 'asset' => '', 'branch' => '', 'path' => '', 'token' => '' ); // an empty row to add one
	?>
<div class="wrap">
  <h1><?php esc_html_e( 'GitHub Updates', 'gh-release-updater' ); ?></h1>
	<?php if ( $msg ) : ?><div class="notice notice-success is-dismissible"><p><?php echo esc_html( $msg ); ?></p></div><?php endif; ?>
  <p><?php esc_html_e( 'Connect an installed plugin or theme to a GitHub repository, and updates appear under Dashboard → Updates for one-click install.', 'gh-release-updater' ); ?></p>
  <ul style="list-style:disc;margin-left:22px;max-width:900px">
    <li><strong><?php esc_html_e( 'Release zip', 'gh-release-updater' ); ?></strong> — <?php esc_html_e( 'updates when you publish a new GitHub release with a zip attached.', 'gh-release-updater' ); ?></li>
    <li><strong><?php esc_html_e( 'Live branch', 'gh-release-updater' ); ?></strong> — <?php esc_html_e( 'updates when a new commit lands on a branch (checked every 15 minutes). Only the changed files are downloaded.', 'gh-release-updater' ); ?></li>
  </ul>
  <form method="post">
	<?php wp_nonce_field( 'ghru_save', 'ghru_nonce' ); ?>
    <table class="widefat striped" style="max-width:1250px">
      <thead><tr>
        <th><?php esc_html_e( 'Plugin or theme', 'gh-release-updater' ); ?></th>
        <th><?php esc_html_e( 'GitHub repository', 'gh-release-updater' ); ?></th>
        <th><?php esc_html_e( 'Updates from', 'gh-release-updater' ); ?></th>
        <th><?php esc_html_e( 'Token (private repos only)', 'gh-release-updater' ); ?></th>
        <th><?php esc_html_e( 'Install automatically', 'gh-release-updater' ); ?></th>
        <th><?php esc_html_e( 'Status', 'gh-release-updater' ); ?></th>
      </tr></thead>
      <tbody>
	<?php foreach ( $sources as $i => $s ) : ?>
		<?php
		$has = '' !== $s['repo'];
		$st  = $has ? ghru_state( $s ) : array();
		if ( ! $has ) {
			$state = '';
		} elseif ( isset( $st['error'] ) ) {
			$state = '<span style="color:#b32d2e">' . esc_html( $st['error'] ) . '</span>';
		} elseif ( $st['available'] ) {
			$what  = 'branch' === $s['mode'] ? ( ! empty( $st['linked'] ) ? sprintf( /* translators: %s: short commit id */ __( 'New commit %s', 'gh-release-updater' ), $st['short'] ) : sprintf( __( 'Ready to install the latest (%s)', 'gh-release-updater' ), $st['short'] ) ) : sprintf( __( 'Update available: %1$s → %2$s', 'gh-release-updater' ), $st['have'], $st['new_version'] );
			$state = '<strong>' . esc_html( $what ) . '</strong> — <a href="' . esc_url( ghru_update_link( $s ) ) . '">' . esc_html__( 'Update now', 'gh-release-updater' ) . '</a>';
		} else {
			$state = esc_html( 'branch' === $s['mode'] ? sprintf( __( 'Up to date (commit %s)', 'gh-release-updater' ), $st['short'] ) : sprintf( __( 'Up to date (%s)', 'gh-release-updater' ), $st['have'] ) );
		}
		$base = 'src[' . (int) $i . ']';
		$n    = esc_attr( $base );
		?>
        <tr class="ghru-row">
          <td><select name="<?php echo $n; // phpcs:ignore ?>[item]">
            <option value=""><?php echo $has ? '' : esc_html__( '— add another —', 'gh-release-updater' ); ?></option>
		<?php foreach ( $items as $val => $label ) : ?>
            <option value="<?php echo esc_attr( $val ); ?>" <?php selected( $s['item'], $val ); ?>><?php echo esc_html( $label ); ?></option>
		<?php endforeach; ?>
          </select></td>
          <td><input type="text" class="regular-text" name="<?php echo $n; // phpcs:ignore ?>[repo]" value="<?php echo esc_attr( $s['repo'] ); ?>" placeholder="owner/name" autocomplete="off" spellcheck="false"></td>
          <td>
            <select class="ghru-mode" name="<?php echo $n; // phpcs:ignore ?>[mode]">
              <option value="release" <?php selected( $s['mode'], 'release' ); ?>><?php esc_html_e( 'Release zip', 'gh-release-updater' ); ?></option>
              <option value="branch" <?php selected( $s['mode'], 'branch' ); ?>><?php esc_html_e( 'Live branch', 'gh-release-updater' ); ?></option>
            </select>
            <div class="ghru-release"><input type="text" name="<?php echo $n; // phpcs:ignore ?>[asset]" value="<?php echo esc_attr( $s['asset'] ); ?>" placeholder="<?php esc_attr_e( 'zip name (default folder-name.zip)', 'gh-release-updater' ); ?>" autocomplete="off" spellcheck="false"></div>
            <div class="ghru-branch">
              <input type="text" name="<?php echo $n; // phpcs:ignore ?>[branch]" value="<?php echo esc_attr( $s['branch'] ); ?>" placeholder="<?php esc_attr_e( 'branch (empty = default)', 'gh-release-updater' ); ?>" autocomplete="off" spellcheck="false"><br>
              <input type="text" name="<?php echo $n; // phpcs:ignore ?>[path]" value="<?php echo esc_attr( $s['path'] ); ?>" placeholder="<?php esc_attr_e( 'folder in repo (empty = whole repo)', 'gh-release-updater' ); ?>" autocomplete="off" spellcheck="false">
            </div>
          </td>
          <td><input type="password" name="<?php echo $n; // phpcs:ignore ?>[token]" value="" autocomplete="new-password" spellcheck="false" placeholder="<?php echo ! empty( $s['token'] ) ? esc_attr__( 'Saved — leave empty to keep', 'gh-release-updater' ) : esc_attr__( 'Public repo: leave empty', 'gh-release-updater' ); ?>">
		<?php if ( ! empty( $s['token'] ) ) : ?><br><label><input type="checkbox" name="<?php echo $n; // phpcs:ignore ?>[clear_token]" value="1"> <?php esc_html_e( 'Remove saved token', 'gh-release-updater' ); ?></label><?php endif; ?></td>
          <td><?php if ( $has ) : ?><label><input type="checkbox" name="<?php echo $n; // phpcs:ignore ?>[auto]" value="1" <?php checked( ghru_is_auto( $s ) ); ?>> <?php esc_html_e( 'On', 'gh-release-updater' ); ?></label><?php else : ?>&nbsp;<?php endif; ?></td>
          <td><?php echo $state; // phpcs:ignore WordPress.Security.EscapeOutput -- built from escaped parts above. ?></td>
        </tr>
	<?php endforeach; ?>
      </tbody>
    </table>
    <p class="description" style="max-width:1100px"><?php esc_html_e( 'To stop updating something, clear its repository box and save. Release zips need a published release with a version tag (like v1.2.3) and a zip with one top-level folder. A private-repository token needs only read access to that repository; keeping it in wp-config.php as define( \'GHRU_TOKEN\', \'…\' ); is safer and takes priority.', 'gh-release-updater' ); ?></p>
    <p class="description" style="max-width:1100px"><strong><?php esc_html_e( 'Install automatically', 'gh-release-updater' ); ?></strong> — <?php esc_html_e( 'when on, WordPress installs new updates for that item by itself (this switches on WordPress’s own auto-update for it). Anyone who can push to that branch or publish that release can then change the code running on this site, so protect the repository with two-factor authentication. Leave it off to approve each update with a click.', 'gh-release-updater' ); ?></p>
    <p class="submit"><?php submit_button( __( 'Save and check GitHub now', 'gh-release-updater' ), 'primary', 'ghru_save', false ); ?></p>
  </form>
</div>
<script>
(function () {
  function sync(row) {
    var m = row.querySelector('.ghru-mode').value;
    row.querySelector('.ghru-release').style.display = m === 'release' ? '' : 'none';
    row.querySelector('.ghru-branch').style.display = m === 'branch' ? '' : 'none';
  }
  document.querySelectorAll('.ghru-row').forEach(function (row) {
    sync(row);
    row.querySelector('.ghru-mode').addEventListener('change', function () { sync(row); });
  });
})();
</script>
	<?php
}
