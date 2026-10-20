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

/** Cleans the submitted rows; a row with no repository is dropped. A blank token keeps the one already saved (encrypted). */
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
		$tok      = isset( $r['token'] ) ? trim( sanitize_text_field( $r['token'] ) ) : '';
		$tok      = '' !== $tok ? ghru_seal( $tok ) : '';
		$verified = array();
		foreach ( $old as $o ) {
			if ( isset( $o['item'], $o['repo'] ) && $o['item'] === $item && $o['repo'] === $repo ) {
				if ( '' === $tok && empty( $r['clear_token'] ) && isset( $o['token'] ) ) {
					$tok = $o['token'];
				}
				$verified = isset( $o['verified'] ) && is_array( $o['verified'] ) ? $o['verified'] : array();
			}
		}
		$trusted = isset( $r['trusted'] ) ? preg_replace( '/[^A-Za-z0-9_,\s-]/', '', sanitize_text_field( $r['trusted'] ) ) : '';
		$out[]   = array(
			'item'     => $item,
			'repo'     => $repo,
			'mode'     => $mode,
			'asset'    => isset( $r['asset'] ) ? sanitize_file_name( $r['asset'] ) : '',
			'branch'   => $branch,
			'path'     => $path,
			'token'    => $tok,
			'trusted'  => trim( $trusted ),
			'signed'   => ! empty( $r['signed'] ) ? 1 : 0,
			'private'  => ! empty( $r['private'] ) ? 1 : 0,
			'auto'     => ! empty( $r['auto'] ) ? 1 : 0,
			'verified' => $verified, // stays valid only while every setting still hashes to the same fingerprint.
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
		if ( ! empty( $r['auto'] ) && ghru_is_verified( wp_parse_args( $r, array( 'trusted' => '' ) ) ) ) {
			$list[] = $id; // only a verified connection may install by itself.
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
	$msg    = '';
	$vindex = -1;
	if ( isset( $_POST['ghru_nonce'] ) && wp_verify_nonce( sanitize_key( $_POST['ghru_nonce'] ), 'ghru_save' ) ) {
		$rows = ghru_clean_rows( isset( $_POST['src'] ) ? wp_unslash( $_POST['src'] ) : array(), ghru_sources() ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		update_option( 'ghru_sources', $rows, false );
		if ( isset( $_POST['ghru_verify'] ) ) {
			$vindex = (int) $_POST['ghru_verify'];
			ghru_verify_and_store( $vindex );
		}
		ghru_apply_auto( ghru_sources() );
		foreach ( ghru_sources() as $r ) {
			delete_site_transient( 'ghru_' . md5( $r['repo'] . '|' . ghru_token( $r ) ) );
			delete_site_transient( 'ghru_br_' . md5( ghru_fingerprint( $r ) ) );
		}
		delete_site_transient( 'update_plugins' );
		delete_site_transient( 'update_themes' );
		wp_update_plugins();
		wp_update_themes();
		$msg = __( 'Saved.', 'gh-release-updater' );
	}
	$vlog = get_site_transient( 'ghru_verify_log_' . get_current_user_id() );
	delete_site_transient( 'ghru_verify_log_' . get_current_user_id() );

	$sources   = ghru_sources();
	$items     = ghru_installed_items();
	$sources[] = array( 'item' => '', 'repo' => '', 'mode' => 'release', 'asset' => '', 'branch' => '', 'path' => '', 'token' => '', 'trusted' => '', 'signed' => 1, 'private' => 1, 'verified' => array() ); // an empty card to add one
	?>
<div class="wrap">
  <h1><?php esc_html_e( 'GitHub Updates', 'gh-release-updater' ); ?></h1>
	<?php if ( $msg ) : ?><div class="notice notice-success is-dismissible"><p><?php echo esc_html( $msg ); ?></p></div><?php endif; ?>
  <p style="max-width:900px"><?php esc_html_e( 'Connect an installed plugin or theme to a GitHub repository. A connection does nothing until you press “Verify connection”, and it stops working again if you change any of its settings. Updates then appear under Dashboard → Updates for one-click install. Before every update the version you have is saved, so you can always go back.', 'gh-release-updater' ); ?></p>
  <form method="post">
	<?php wp_nonce_field( 'ghru_save', 'ghru_nonce' ); ?>
	<?php foreach ( $sources as $i => $s ) : ?>
		<?php
		$has = '' !== $s['repo'];
		$st  = $has ? ghru_state( $s ) : array();
		$ver = $has && ghru_is_verified( $s );
		$n   = esc_attr( 'src[' . (int) $i . ']' );
		if ( ! $has ) {
			$state = '';
		} elseif ( ! $ver ) {
			$state = '<span style="color:#b32d2e">' . esc_html__( 'Not verified — nothing will be installed. Press “Verify connection”.', 'gh-release-updater' ) . '</span>';
		} elseif ( isset( $st['error'] ) ) {
			$state = '<span style="color:#b32d2e">' . esc_html( $st['error'] ) . '</span>';
		} elseif ( ! empty( $st['held'] ) ) {
			$state = esc_html__( 'On hold after a rollback — a newer version or commit will be offered when it arrives.', 'gh-release-updater' ) . ' <a href="' . esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=ghru_unhold' ), 'ghru_unhold' ) ) . '">' . esc_html__( 'Resume updates now', 'gh-release-updater' ) . '</a>';
		} elseif ( $st['available'] ) {
			$what  = 'branch' === $s['mode'] ? sprintf( /* translators: %s: short commit id */ __( 'New commit %s ready to install', 'gh-release-updater' ), $st['short'] ) : sprintf( __( 'Update available: %1$s → %2$s', 'gh-release-updater' ), $st['have'], $st['new_version'] );
			$state = '<strong>' . esc_html( $what ) . '</strong> — <a href="' . esc_url( ghru_update_link( $s ) ) . '">' . esc_html__( 'Update now', 'gh-release-updater' ) . '</a>';
		} else {
			$state = esc_html( 'branch' === $s['mode'] ? sprintf( __( 'Up to date (commit %s)', 'gh-release-updater' ), $st['short'] ) : sprintf( __( 'Up to date (%s)', 'gh-release-updater' ), $st['have'] ) );
		}
		?>
    <div class="ghru-card" style="background:#fff;border:1px solid #c3c4c7;border-left:4px solid <?php echo $has ? ( $ver ? '#00a32a' : '#dba617' ) : '#c3c4c7'; ?>;padding:14px 18px;margin:0 0 16px;max-width:980px">
      <table class="form-table" role="presentation" style="margin:0"><tbody>
        <tr><th scope="row"><?php esc_html_e( 'Plugin or theme', 'gh-release-updater' ); ?></th><td>
          <select name="<?php echo $n; // phpcs:ignore ?>[item]">
            <option value=""><?php echo $has ? '' : esc_html__( '— choose to add a connection —', 'gh-release-updater' ); ?></option>
		<?php foreach ( $items as $val => $label ) : ?>
            <option value="<?php echo esc_attr( $val ); ?>" <?php selected( $s['item'], $val ); ?>><?php echo esc_html( $label ); ?></option>
		<?php endforeach; ?>
          </select></td></tr>
        <tr><th scope="row"><?php esc_html_e( 'GitHub repository', 'gh-release-updater' ); ?></th><td><input type="text" class="regular-text" name="<?php echo $n; // phpcs:ignore ?>[repo]" value="<?php echo esc_attr( $s['repo'] ); ?>" placeholder="owner/name" autocomplete="off" spellcheck="false"></td></tr>
        <tr><th scope="row"><?php esc_html_e( 'Updates from', 'gh-release-updater' ); ?></th><td>
          <select class="ghru-mode" name="<?php echo $n; // phpcs:ignore ?>[mode]">
            <option value="release" <?php selected( $s['mode'], 'release' ); ?>><?php esc_html_e( 'Release zip (a published GitHub release)', 'gh-release-updater' ); ?></option>
            <option value="branch" <?php selected( $s['mode'], 'branch' ); ?>><?php esc_html_e( 'Live branch (the newest commit, checked every 15 minutes)', 'gh-release-updater' ); ?></option>
          </select>
          <div class="ghru-release" style="margin-top:6px"><input type="text" name="<?php echo $n; // phpcs:ignore ?>[asset]" value="<?php echo esc_attr( $s['asset'] ); ?>" placeholder="<?php esc_attr_e( 'zip name (default: folder-name.zip)', 'gh-release-updater' ); ?>" autocomplete="off" spellcheck="false"></div>
          <div class="ghru-branch" style="margin-top:6px">
            <input type="text" name="<?php echo $n; // phpcs:ignore ?>[branch]" value="<?php echo esc_attr( $s['branch'] ); ?>" placeholder="<?php esc_attr_e( 'branch (empty = default)', 'gh-release-updater' ); ?>" autocomplete="off" spellcheck="false">
            <input type="text" name="<?php echo $n; // phpcs:ignore ?>[path]" value="<?php echo esc_attr( $s['path'] ); ?>" placeholder="<?php esc_attr_e( 'folder in repo (empty = whole repo)', 'gh-release-updater' ); ?>" autocomplete="off" spellcheck="false">
          </div></td></tr>
        <tr><th scope="row"><?php esc_html_e( 'Token', 'gh-release-updater' ); ?></th><td>
          <input type="password" class="regular-text" name="<?php echo $n; // phpcs:ignore ?>[token]" value="" autocomplete="new-password" spellcheck="false" placeholder="<?php echo ! empty( $s['token'] ) ? esc_attr__( 'Saved (encrypted) — leave empty to keep', 'gh-release-updater' ) : esc_attr__( 'Needed for a private repository', 'gh-release-updater' ); ?>">
		<?php if ( ! empty( $s['token'] ) ) : ?> <label><input type="checkbox" name="<?php echo $n; // phpcs:ignore ?>[clear_token]" value="1"> <?php esc_html_e( 'Remove saved token', 'gh-release-updater' ); ?></label><?php endif; ?>
          <p class="description"><?php esc_html_e( 'Use a fine-grained token: only this repository, “Contents: Read-only”. It is stored encrypted. Or put it in wp-config.php (GHRU_TOKEN), which takes priority.', 'gh-release-updater' ); ?></p></td></tr>
        <tr><th scope="row"><?php esc_html_e( 'Who may change this site', 'gh-release-updater' ); ?></th><td>
          <input type="text" class="regular-text" name="<?php echo $n; // phpcs:ignore ?>[trusted]" value="<?php echo esc_attr( $s['trusted'] ); ?>" placeholder="<?php esc_attr_e( 'GitHub accounts, e.g. claude, yourname', 'gh-release-updater' ); ?>" autocomplete="off" spellcheck="false">
          <p class="description"><?php esc_html_e( 'Live branch: only commits made by these accounts are installed (every new commit is checked). Empty = any account that can write to the branch.', 'gh-release-updater' ); ?></p>
          <label><input type="checkbox" name="<?php echo $n; // phpcs:ignore ?>[signed]" value="1" <?php checked( ! empty( $s['signed'] ) ); ?>> <?php esc_html_e( 'Only install commits that GitHub marks as verified (signed)', 'gh-release-updater' ); ?></label><br>
          <label><input type="checkbox" name="<?php echo $n; // phpcs:ignore ?>[private]" value="1" <?php checked( ! empty( $s['private'] ) ); ?>> <?php esc_html_e( 'Only accept a private repository (refuse to connect to a public one)', 'gh-release-updater' ); ?></label></td></tr>
		<?php if ( $has ) : ?>
        <tr><th scope="row"><?php esc_html_e( 'Install automatically', 'gh-release-updater' ); ?></th><td>
          <label><input type="checkbox" name="<?php echo $n; // phpcs:ignore ?>[auto]" value="1" <?php checked( ghru_is_auto( $s ) ); ?>> <?php esc_html_e( 'On: WordPress installs new updates by itself (only for a verified connection)', 'gh-release-updater' ); ?></label>
          <p class="description"><?php esc_html_e( 'Leave off to approve each update with one click. Turn on only for a repository where every account that can write is one you trust, with two-factor sign-in.', 'gh-release-updater' ); ?></p></td></tr>
        <tr><th scope="row"><?php esc_html_e( 'Connection', 'gh-release-updater' ); ?></th><td>
          <button type="submit" name="ghru_verify" value="<?php echo (int) $i; ?>" class="button button-primary"><?php esc_html_e( 'Save and verify connection', 'gh-release-updater' ); ?></button>
		<?php if ( $ver ) : ?>
          <span style="margin-left:8px">✓ <?php echo esc_html( sprintf( /* translators: 1: account 2: date */ __( 'Verified%1$s on %2$s', 'gh-release-updater' ), ! empty( $s['verified']['login'] ) ? ' as ' . $s['verified']['login'] : '', wp_date( 'j M Y, g:i a', (int) $s['verified']['at'] ) ) ); ?></span>
		<?php endif; ?>
		<?php if ( is_array( $vlog ) && (int) $vlog['index'] === $i ) : ?>
          <div style="margin-top:8px;padding:8px 12px;background:<?php echo $vlog['ok'] ? '#edfaef' : '#fcf0f1'; ?>;border-left:4px solid <?php echo $vlog['ok'] ? '#00a32a' : '#d63638'; ?>">
			<?php foreach ( $vlog['log'] as $line ) : ?><div><?php echo esc_html( $line ); ?></div><?php endforeach; ?>
          </div>
		<?php endif; ?></td></tr>
        <tr><th scope="row"><?php esc_html_e( 'Status', 'gh-release-updater' ); ?></th><td><?php echo $state; // phpcs:ignore WordPress.Security.EscapeOutput -- built from escaped parts above. ?></td></tr>
			<?php $bk = $ver ? ghru_backups( $s ) : array(); ?>
			<?php if ( $bk ) : ?>
        <tr><th scope="row"><?php esc_html_e( 'Go back', 'gh-release-updater' ); ?></th><td>
          <p class="description" style="margin-top:0"><?php esc_html_e( 'The version that was installed before each update (the last three are kept).', 'gh-release-updater' ); ?></p>
				<?php foreach ( $bk as $b ) : ?>
          <div><?php echo esc_html( wp_date( 'j M Y, g:i a', (int) $b['time'] ) . ' — ' . ( $b['version'] ? 'v' . $b['version'] : '' ) . ( $b['sha'] ? ' (commit ' . substr( $b['sha'], 0, 7 ) . ')' : '' ) ); ?>
            <a href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=ghru_restore&k=' . substr( ghru_src_key( $s ), 0, 16 ) . '&f=' . rawurlencode( $b['file'] ) ), 'ghru_restore_' . substr( ghru_src_key( $s ), 0, 16 ) . $b['file'] ) ); ?>" onclick="return confirm('<?php echo esc_js( __( 'Install this saved version over the current one? Updates stay on hold until something newer arrives.', 'gh-release-updater' ) ); ?>')"><?php esc_html_e( 'Restore this version', 'gh-release-updater' ); ?></a></div>
				<?php endforeach; ?>
        </td></tr>
			<?php endif; ?>
		<?php endif; ?>
      </tbody></table>
    </div>
	<?php endforeach; ?>
    <p class="description" style="max-width:900px"><?php esc_html_e( 'To stop updating something, clear its repository box and save.', 'gh-release-updater' ); ?></p>
    <p class="submit"><?php submit_button( __( 'Save', 'gh-release-updater' ), 'secondary', 'ghru_save', false ); ?></p>
  </form>
</div>
<script>
(function () {
  function sync(card) {
    var m = card.querySelector('.ghru-mode').value;
    card.querySelector('.ghru-release').style.display = m === 'release' ? '' : 'none';
    card.querySelector('.ghru-branch').style.display = m === 'branch' ? '' : 'none';
  }
  document.querySelectorAll('.ghru-card').forEach(function (card) {
    sync(card);
    card.querySelector('.ghru-mode').addEventListener('change', function () { sync(card); });
  });
})();
</script>
	<?php
}
