# GitHub Release Updater

A small WordPress plugin that gives **your own plugins and themes** one-click updates from **GitHub**, in either of two ways:

| | **Release zip** | **Live branch** |
|---|---|---|
| WordPress updates when | you publish a GitHub release with a zip | a new commit lands on a branch |
| You do on GitHub | tag and release (a workflow can build the zip) | just push |
| Downloaded | the whole zip | only the files that changed |
| Good for | versioned, deliberate releases | "I push, the site follows" |

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

## Live branch: push to GitHub and the site follows

1. In **Settings → GitHub Updates** choose **Updates from: Live branch**, then fill in:
   - **branch**: the branch to follow (empty = the repository's default branch);
   - **folder in repo**: where the plugin or theme sits inside the repository, e.g. `wordpress/my-plugin` (empty = the whole repository).
2. Every 15 minutes the site asks GitHub for the newest commit **that touched that folder**. Commits elsewhere in the repository are ignored.
3. When there is one, it appears under **Dashboard → Updates** and in the plugin's row here ("Update now").
4. The update is built from the files you already have plus the differences: GitHub's checksums are compared with your files,
   and only changed or new files are downloaded. Deleted files are removed. WordPress then installs it the normal way
   (maintenance mode, replace, reactivate). Since WordPress 6.6 a plugin update that causes a fatal error is rolled back automatically.
5. **Install automatically** (optional): switches on WordPress's own auto-update for that item, so new commits install on their own
   within about 15 minutes. Leave it off to approve each update with one click.

No address is opened on your site for GitHub to call, so there is no webhook to secure; the site simply asks GitHub.
Public repositories need no token. Needs the PHP `ZipArchive` extension (almost every host has it).

### Why this is the right direction

Plugins that *push* files from WordPress up to GitHub (for example, one that uploads a plugin folder with a token)
are useful for backups, but the live site then becomes the source of truth. Here GitHub is the source of truth and the
site follows it, so you never upload zips by hand.

## What your repository needs (Release zip mode)

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
- Live-branch packages are rebuilt locally; file paths containing `..`, symbolic links and anything outside the chosen folder are ignored.
- **Install automatically** means whoever can push to that branch (or publish that release) can change the code running on the site. Use two-factor authentication on GitHub and, for important sites, leave automatic installs off.
- Updates are as trustworthy as your GitHub account: turn on two-factor authentication.
- WordPress does not verify signatures on these zips; it trusts the release you published.

## Update this plugin itself

Add this plugin as a source in its own list: pick **GitHub Release Updater**, repository `<your-account>/<this-repo>`.
Use **Release zip** (zip file `gh-release-updater.zip`), or **Live branch** with folder `gh-release-updater`.

## Remove

Deactivate and delete the plugin; its settings and cache are removed. Installed plugins and themes are untouched.
