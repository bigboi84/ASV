<?php
/**
 * "Verify connection": a source installs nothing until it has passed these checks with exactly its current settings.
 *
 * @package GH_Release_Updater
 */

defined( 'ABSPATH' ) || exit;

/** GET a GitHub API route for a source. @return array( status code, decoded body, response ) */
function ghru_gh( $src, $route ) {
	$r = wp_remote_get( 'https://api.github.com' . $route, array( 'timeout' => 15, 'headers' => ghru_headers( $src ) ) );
	if ( is_wp_error( $r ) ) {
		return array( 0, null, $r );
	}
	return array( (int) wp_remote_retrieve_response_code( $r ), json_decode( wp_remote_retrieve_body( $r ), true ), $r );
}

/**
 * Checks the token, the repository, the branch and folder (or the release), and who made the newest commit.
 *
 * @return array ok (bool), log (string[] lines), login, private.
 */
function ghru_verify( $src ) {
	$log   = array();
	$ok    = true;
	$login = '';
	$priv  = false;
	$fail  = function ( $line ) use ( &$log, &$ok ) {
		$log[] = '✗ ' . $line;
		$ok    = false;
	};

	if ( ! ghru_valid_repo( $src['repo'] ) || ! ghru_branch_ok( $src['branch'] ) || ! ghru_path_ok( $src['path'] ) ) {
		$fail( __( 'The repository, branch or folder is not valid.', 'gh-release-updater' ) );
		return array( 'ok' => false, 'log' => $log, 'login' => '', 'private' => false );
	}

	// 1. Who is the token?
	if ( ghru_token( $src ) ) {
		list( $c, $d ) = ghru_gh( $src, '/user' );
		if ( 200 === $c && ! empty( $d['login'] ) ) {
			$login = (string) $d['login'];
			$log[] = '✓ ' . sprintf( /* translators: %s: GitHub account */ __( 'The token belongs to the GitHub account “%s”.', 'gh-release-updater' ), $login );
		} elseif ( 401 === $c ) {
			$fail( __( 'GitHub did not accept the token (wrong, expired or revoked).', 'gh-release-updater' ) );
		} else {
			$log[] = '• ' . __( 'The token could not be matched to an account (that is fine for some fine-grained tokens).', 'gh-release-updater' );
		}
	} else {
		$log[] = '• ' . __( 'No token: only a public repository can be read.', 'gh-release-updater' );
	}

	// 2. The repository.
	list( $c, $d ) = ghru_gh( $src, '/repos/' . $src['repo'] );
	$branch        = $src['branch'];
	if ( 200 === $c && is_array( $d ) ) {
		$priv   = ! empty( $d['private'] );
		$log[]  = '✓ ' . sprintf( __( 'Repository %1$s found (%2$s).', 'gh-release-updater' ), $d['full_name'], $priv ? __( 'private', 'gh-release-updater' ) : __( 'public', 'gh-release-updater' ) );
		$branch = $branch ? $branch : (string) $d['default_branch'];
		if ( ! empty( $src['private'] ) && ! $priv ) {
			$fail( __( 'This repository is PUBLIC, but “Only accept a private repository” is ticked. Make it private on GitHub, or untick that box.', 'gh-release-updater' ) );
		}
	} else {
		$fail( 404 === $c ? __( 'Repository not found. Check the name — a private repository also needs a token that can read it.', 'gh-release-updater' ) : ghru_api_error( $c ) );
	}

	if ( $ok && 'branch' === $src['mode'] ) {
		// 3. The branch and the folder.
		list( $c ) = ghru_gh( $src, '/repos/' . $src['repo'] . '/branches/' . implode( '/', array_map( 'rawurlencode', explode( '/', $branch ) ) ) );
		if ( 200 === $c ) {
			$log[] = '✓ ' . sprintf( __( 'Branch “%s” found.', 'gh-release-updater' ), $branch );
		} else {
			$fail( sprintf( __( 'Branch “%s” was not found.', 'gh-release-updater' ), $branch ) );
		}
		if ( $ok && '' !== $src['path'] ) {
			list( $c, $d ) = ghru_gh( $src, '/repos/' . $src['repo'] . '/contents/' . implode( '/', array_map( 'rawurlencode', explode( '/', $src['path'] ) ) ) . '?ref=' . rawurlencode( $branch ) );
			if ( 200 === $c && is_array( $d ) && isset( $d[0] ) ) {
				$log[] = '✓ ' . sprintf( __( 'Folder “%s” found.', 'gh-release-updater' ), $src['path'] );
			} else {
				$fail( sprintf( __( 'Folder “%s” was not found on that branch.', 'gh-release-updater' ), $src['path'] ) );
			}
		}
		// 4. Who made the newest commit?
		if ( $ok ) {
			$l = ghru_branch_latest( $src, true );
			if ( isset( $l['error'] ) ) {
				$fail( $l['error'] );
			} else {
				$log[] = '✓ ' . sprintf( __( 'Newest commit %1$s%2$s.', 'gh-release-updater' ), $l['short'], $l['by'] ? sprintf( __( ' by “%s”', 'gh-release-updater' ), $l['by'] ) : '' );
				if ( ghru_trusted( $src ) || ! empty( $src['signed'] ) ) {
					$log[] = '✓ ' . __( 'It passes your trust rules (trusted accounts / signed commits).', 'gh-release-updater' );
				} else {
					$log[] = '• ' . __( 'No trust rules are set, so a commit from any account that can write to the branch would be accepted.', 'gh-release-updater' );
				}
			}
		}
	} elseif ( $ok ) {
		$rel = ghru_release( $src, true );
		if ( isset( $rel['error'] ) ) {
			$fail( $rel['error'] );
		} else {
			$log[] = '✓ ' . sprintf( __( 'Latest release %s has the zip file attached.', 'gh-release-updater' ), $rel['version'] );
		}
	}

	return array( 'ok' => $ok, 'log' => $log, 'login' => $login, 'private' => $priv );
}

/** Runs the verification and stores the result on the source (the fingerprint ties it to today's settings). */
function ghru_verify_and_store( $index ) {
	$all = ghru_sources();
	if ( ! isset( $all[ $index ] ) ) {
		return array( 'ok' => false, 'log' => array( '✗ ' . __( 'Save the row first.', 'gh-release-updater' ) ) );
	}
	$res = ghru_verify( $all[ $index ] );
	if ( $res['ok'] ) {
		$all[ $index ]['verified'] = array( 'fp' => ghru_fingerprint( $all[ $index ] ), 'login' => $res['login'], 'private' => $res['private'], 'at' => time() );
	} else {
		$all[ $index ]['verified'] = array();
	}
	update_option( 'ghru_sources', $all, false );
	set_site_transient( 'ghru_verify_log_' . get_current_user_id(), array( 'index' => $index, 'ok' => $res['ok'], 'log' => $res['log'] ), 10 * MINUTE_IN_SECONDS );
	delete_site_transient( 'update_plugins' );
	delete_site_transient( 'update_themes' );
	return $res;
}
