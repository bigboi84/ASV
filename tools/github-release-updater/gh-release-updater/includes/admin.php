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
		$tok = isset( $r['token'] ) ? trim( sanitize_text_field( $r['token'] ) ) : '';
		if ( '' === $tok && empty( $r['clear_token'] ) ) {
			foreach ( $old as $o ) {
				if ( isset( $o['item'], $o['repo'], $o['token'] ) && $o['item'] === $item && $o['repo'] === $repo ) {
					$tok = $o['token'];
				}
			}
		}
		$out[] = array(
			'item'  => $item,
			'repo'  => $repo,
			'asset' => isset( $r['asset'] ) ? sanitize_file_name( $r['asset'] ) : '',
			'token' => $tok,
		);
	}
	return $out;
}

function ghru_screen() {
	if ( ! current_user_can( 'update_plugins' ) ) {
		return;
	}
	$msg = '';
	if ( isset( $_POST['ghru_nonce'] ) && wp_verify_nonce( sanitize_key( $_POST['ghru_nonce'] ), 'ghru_save' ) ) {
		$rows = ghru_clean_rows( isset( $_POST['src'] ) ? wp_unslash( $_POST['src'] ) : array(), ghru_sources() ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		update_option( 'ghru_sources', $rows, false );
		// Fresh look-up, then let WordPress rebuild its update lists.
		foreach ( $rows as $r ) {
			delete_site_transient( 'ghru_' . md5( $r['repo'] . '|' . ghru_token( $r ) ) );
		}
		delete_site_transient( 'update_plugins' );
		delete_site_transient( 'update_themes' );
		wp_update_plugins();
		wp_update_themes();
		$msg = isset( $_POST['ghru_check'] ) ? __( 'Saved and checked GitHub.', 'gh-release-updater' ) : __( 'Saved.', 'gh-release-updater' );
	}
	$sources = ghru_sources();
	$items   = ghru_installed_items();
	$sources[] = array( 'item' => '', 'repo' => '', 'asset' => '', 'token' => '' ); // an empty row to add one
	?>
<div class="wrap">
  <h1><?php esc_html_e( 'GitHub Updates', 'gh-release-updater' ); ?></h1>
	<?php if ( $msg ) : ?><div class="notice notice-success is-dismissible"><p><?php echo esc_html( $msg ); ?></p></div><?php endif; ?>
  <p><?php esc_html_e( 'Connect an installed plugin or theme to a GitHub repository. When you publish a new release there, it shows up under Dashboard → Updates and you install it with one click. Nothing is installed without your click (unless you switch on WordPress auto-updates for that item).', 'gh-release-updater' ); ?></p>
  <form method="post">
	<?php wp_nonce_field( 'ghru_save', 'ghru_nonce' ); ?>
    <table class="widefat striped" style="max-width:1100px">
      <thead><tr>
        <th><?php esc_html_e( 'Plugin or theme', 'gh-release-updater' ); ?></th>
        <th><?php esc_html_e( 'GitHub repository', 'gh-release-updater' ); ?></th>
        <th><?php esc_html_e( 'Zip file in the release', 'gh-release-updater' ); ?></th>
        <th><?php esc_html_e( 'Token (private repos only)', 'gh-release-updater' ); ?></th>
        <th><?php esc_html_e( 'Status', 'gh-release-updater' ); ?></th>
      </tr></thead>
      <tbody>
	<?php foreach ( $sources as $i => $s ) : ?>
		<?php
		$has = '' !== $s['repo'];
		$rel = $has ? ghru_release( $s ) : array();
		$ver = $has ? ghru_installed_version( $s ) : '';
		if ( ! $has ) {
			$state = '';
		} elseif ( ! $ver ) {
			$state = esc_html__( 'Not installed', 'gh-release-updater' );
		} elseif ( isset( $rel['error'] ) ) {
			$state = '<span style="color:#b32d2e">' . esc_html( $rel['error'] ) . '</span>';
		} elseif ( version_compare( $rel['version'], $ver, '>' ) ) {
			$state = '<strong>' . esc_html( sprintf( /* translators: 1: installed 2: latest */ __( 'Update available: %1$s → %2$s', 'gh-release-updater' ), $ver, $rel['version'] ) ) . '</strong> — <a href="' . esc_url( admin_url( 'update-core.php' ) ) . '">' . esc_html__( 'Dashboard → Updates', 'gh-release-updater' ) . '</a>';
		} else {
			$state = esc_html( sprintf( /* translators: %s: version */ __( 'Up to date (%s)', 'gh-release-updater' ), $ver ) );
		}
		$base = 'src[' . (int) $i . ']';
		?>
        <tr>
          <td><select name="<?php echo esc_attr( $base ); ?>[item]">
            <option value=""><?php echo $has ? '' : esc_html__( '— add another —', 'gh-release-updater' ); ?></option>
		<?php foreach ( $items as $val => $label ) : ?>
            <option value="<?php echo esc_attr( $val ); ?>" <?php selected( $s['item'], $val ); ?>><?php echo esc_html( $label ); ?></option>
		<?php endforeach; ?>
          </select></td>
          <td><input type="text" class="regular-text" name="<?php echo esc_attr( $base ); ?>[repo]" value="<?php echo esc_attr( $s['repo'] ); ?>" placeholder="owner/name" autocomplete="off" spellcheck="false"></td>
          <td><input type="text" name="<?php echo esc_attr( $base ); ?>[asset]" value="<?php echo esc_attr( $s['asset'] ); ?>" placeholder="<?php esc_attr_e( 'folder-name.zip (default)', 'gh-release-updater' ); ?>" autocomplete="off" spellcheck="false"></td>
          <td><input type="password" name="<?php echo esc_attr( $base ); ?>[token]" value="" autocomplete="new-password" spellcheck="false" placeholder="<?php echo ! empty( $s['token'] ) ? esc_attr__( 'Saved — leave empty to keep', 'gh-release-updater' ) : esc_attr__( 'Public repo: leave empty', 'gh-release-updater' ); ?>">
		<?php if ( ! empty( $s['token'] ) ) : ?><br><label><input type="checkbox" name="<?php echo esc_attr( $base ); ?>[clear_token]" value="1"> <?php esc_html_e( 'Remove saved token', 'gh-release-updater' ); ?></label><?php endif; ?></td>
          <td><?php echo $state; // phpcs:ignore WordPress.Security.EscapeOutput -- built from escaped parts above. ?></td>
        </tr>
	<?php endforeach; ?>
      </tbody>
    </table>
    <p class="description" style="max-width:1100px"><?php esc_html_e( 'To stop updating something, clear its repository box and save. The zip must be attached to a published GitHub release whose tag is a version such as v1.2.3, and it must contain one top-level folder. Prefer keeping a private-repository token in wp-config.php: define( \'GHRU_TOKEN\', \'…\' ); — that takes priority over a saved one.', 'gh-release-updater' ); ?></p>
    <p class="submit">
		<?php submit_button( __( 'Save', 'gh-release-updater' ), 'primary', 'ghru_save', false ); ?>
		<?php submit_button( __( 'Save and check GitHub now', 'gh-release-updater' ), 'secondary', 'ghru_check', false ); ?>
    </p>
  </form>
</div>
	<?php
}
