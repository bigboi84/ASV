# GitHub Release Updater

A small WordPress plugin that gives **your own plugins and themes** one-click updates from **GitHub releases**.
Use it on as many WordPress sites as you like. Everything is set in WordPress admin; there is no code to edit.

- Works with **public** repositories (no token) and **private** repositories (a read-only token).
- Updates appear in the normal place: **Dashboard → Updates**, and in the Plugins / Themes lists.
- **Nothing installs without a click**, unless you switch on WordPress's own auto-updates for that item.
- Installs into the folder you already have, so an update can never create a second copy of your plugin or theme.
- Several plugins and themes, each from its own repository, in one list.

## Install (once per website)

1. Download `gh-release-updater.zip` from this repository's **Releases** page.
2. WordPress admin → **Plugins → Add New → Upload Plugin** → choose the zip → **Install Now → Activate**.

## Connect a plugin or theme

1. **Settings → GitHub Updates.**
2. Pick the installed plugin or theme, type its repository as `owner/name` (pasting the GitHub URL also works).
3. Leave "Zip file" empty to use `<folder-name>.zip`, or type the exact file name attached to your releases.
4. **Private repository?** Add a token (see below). Public repository: leave it empty.
5. **Save and check GitHub now.** The Status column shows "Up to date", or "Update available", or what is wrong.

## What your repository needs

- A **published GitHub release** (not a draft or pre-release) whose **tag is a version**, e.g. `v1.4.0`.
- A **zip file attached to that release** (an "asset"), containing **one top-level folder** (your plugin or theme).
  The folder name inside the zip does not have to match; the updater installs into the folder already in use.
- The version in your plugin header (`Version:`) or theme `style.css` must be lower than the release tag for WordPress to offer the update.

### Making the zip automatically

Copy [`examples/release-a-wordpress-plugin-or-theme.yml`](examples/release-a-wordpress-plugin-or-theme.yml) to
`.github/workflows/release.yml` in your plugin's repository and change the three values at the top.
Then either push a tag (`git tag -a v1.4.0 -m "what changed" && git push origin v1.4.0`) or run it by hand under
**Actions → Release → Run workflow**. It checks the tag matches the version header, builds the zip and publishes the release.
The tag message (or the notes box when run by hand) becomes the release notes shown in WordPress.

## Private repositories

Create a **fine-grained personal access token** (GitHub → Settings → Developer settings → Personal access tokens):
repository access = only that repository; permission = **Contents: Read-only**. Nothing else.

Where to put it:

- **Best:** in `wp-config.php`: `define( 'GHRU_TOKEN', 'github_pat_…' );` (all sources), or
  `define( 'GHRU_TOKENS', array( 'owner/name' => 'github_pat_…' ) );` (per repository). These take priority.
- Or paste it in the Token box on the settings page. It is saved in the database and never shown again.

A token also lifts GitHub's anonymous rate limit (60 lookups an hour). The plugin caches results for 6 hours, so a
site normally makes a handful of requests a day.

## Security notes

- Only packages from the configured repository's own release downloads are accepted.
- The token is sent only to `api.github.com`, never to the signed download address GitHub redirects to.
- Updates are as trustworthy as your GitHub account: turn on two-factor authentication.
- WordPress does not verify signatures on these zips; it trusts the release you published.

## Update this plugin itself

Add this plugin as a source in its own list: pick **GitHub Release Updater**, repository `<your-account>/<this-repo>`,
zip file `gh-release-updater.zip`.

## Remove

Deactivate and delete the plugin; its settings and cache are removed. Installed plugins and themes are untouched.
