# Nab

Grab an image, pull it, let go. It's in your Downloads folder.

That's the whole extension. Right-click, wait for the menu, hunt for "Save image
as," confirm the dialog. Four steps, a few seconds, every single time. Do it
forty times before lunch and those seconds turn into minutes you'd rather spend
on the actual work.

- **Store listing:** not yet submitted
- **Extension ID:** assigned by the store on first publish
- **Status:** unpublished — loaded unpacked for development

## Layout

| File | Role |
|-|-|
| `manifest.json` | MV3 manifest |
| `content.js` | Drag detection, the outline, notifications |
| `background.js` | Service worker — does the actual download |
| `test.html` | Local test page, not shipped |
| `icons/` | 16/32/48/128 PNGs |
| `store-assets/` | Listing screenshots, not shipped |

No build step. Two plain JS files and no dependencies.

Only the manifest, the two scripts, and the icons are tracked in git. The rest
lives on disk and is listed in `.gitignore`.

## Why the download happens in the service worker

Here's the thing about content scripts: they can't save a cross-origin image.

Chrome ignores the `download` attribute on an `<a>` the moment the URL points
somewhere else, so the click navigates or opens a tab instead of saving. Nearly
every image worth grabbing lives on a CDN. The obvious approach fails on most of
the web, and reports success while doing it.

`chrome.downloads` has no such restriction. It only runs in the service worker,
so `content.js` watches the drag and `background.js` does the saving:

```
content.js  --{type:'nab-download', url, filename}-->  background.js
content.js  <--------{ok, error}---------------------  chrome.downloads.download()
```

The notification reports whatever comes back. A green outline means you crossed
the threshold, not that the file landed.

## The drag

`mousedown` on an `<img>` records the start point and draws a fixed-position
outline. `mousemove` grows the glow from 0 to 15px as you approach 50px. Cross
it and the outline turns green. Release and it downloads. Escape cancels.

Now, the tempting move is to call `preventDefault()` on `mousedown`, because
that's what kills the browser's native ghost-drag. Don't. It fires before you
know whether this is a drag or a click, so it eats ordinary clicks. Linked
thumbnails stop navigating, site lightboxes never see the event, and the user
blames your extension.

Handle `dragstart` instead. It only fires once a drag actually starts, so
clicks pass straight through to the page and the ghost image still gets
suppressed.

A finished drag does swallow the trailing `click`, so nabbing a linked thumbnail
won't also follow the link.

## Colors

Both live in the injected stylesheet as `--nab-accent` and `--nab-success`.
Crossing the threshold adds `.nab-outline--ready`, which repoints
`--nab-active`. The drag handler writes one custom property, `--nab-glow`, and
toggles one class. It sets no colors itself.

## Filenames

Derived from `URL.pathname`, so query strings never reach the filename:
`photo.jpg?w=800` saves as `photo.jpg`. A path with no extension gets `.png`.
Anything outside `[a-zA-Z0-9.-]` becomes an underscore, capped at 100
characters. For `data:` URLs the MIME subtype becomes the extension, with
`svg+xml` mapping to `svg` and `jpeg` to `jpg`.

One open question: nobody has confirmed `chrome.downloads` even accepts `data:`
URLs, and Chrome's docs don't say. Drag one of the Test 1 images in `test.html`
to settle it. If it fails, that branch is dead code worth deleting.

## What it won't touch

CSS `background-image`, inline `<svg>`, `<canvas>`, video, and bulk selection.
An `.svg` file loaded through `<img>` works fine.

## Permissions

| Permission | Why |
|-|-|
| `downloads` | Saves the file. The whole point. |
| `content_scripts` matching `<all_urls>` | The script has to be on the page to see the drag. |

No `host_permissions`, no `scripting`, no `storage`. Nab makes no network
requests, stores nothing, and sends nothing anywhere.

Worth knowing before you try to trim that warning: `content_scripts.matches`
triggers the same install prompt `host_permissions` would: "Read and change all
your data on all websites." That's the cost of a drag-anywhere tool. Swapping to
`activeTab` + `scripting` drops the warning but makes users click the toolbar
icon on every page first, which is slower than right-click → Save image as and
defeats the point.

## Testing

Load unpacked at `chrome://extensions`, open `test.html`, work the six cases.
The cross-origin one carries the most weight, since that's the case a content
script can't handle alone.

Then check your Downloads folder. A success notification isn't proof.

## When something breaks

Nab runs in two places and they log to different consoles. Drag behavior lands
in the page console (F12). Download failures land in the service worker console,
reached from `chrome://extensions` → Nab → "service worker".

| Symptom | Cause |
|-|-|
| No outline at all | The image is a CSS background, or the page was open before the extension loaded — reload it |
| "Download failed", with a reason | Chrome rejected the URL. The service worker console has the detail |
| "Try reloading the page" | The service worker restarted and the content script lost its connection |
| Works on some sites, not others | Background images, lazy-loaded images that haven't arrived, or sites painting into `<canvas>` |

To confirm the content script is live on a page:

```javascript
document.querySelector('#nab-styles')   // null means it didn't inject
```

## Releasing

1. Bump `version` in `manifest.json`. Chrome rejects a re-upload at the same
   number, and a version burns on *upload*, not on publish, so a draft you
   abandon still eats it.
2. Zip the folder **contents**, not the folder:
   ```bash
   cd projects/nab
   zip -r ../nab-$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])").zip . \
     -x '*.DS_Store' -x '.gitignore' -x 'LICENSE' -x 'README.md' \
     -x 'test.html' -x 'store-assets/*' -x '.git/*'
   ```
3. Upload at [the developer console](https://chrome.google.com/webstore/devconsole) → the item → Package.
4. Tag it: `git tag -a v2.1.0 -m "..."`.

`name` in the manifest sets the public store title. Once published it stays
**Nab**, or the next upload renames the listing for you.

Listing assets render from the HTML sitting beside them:

```bash
cd store-assets
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1280,800 \
  --screenshot="01-drag-to-download.png" "file://$PWD/01-drag-to-download.html"
```

Keep `--force-device-scale-factor=1`. Without it a retina display renders at 2×
and the store rejects the file.

## Known: the icon has a white background

`icons/*.png` carry no transparency. Every corner is `srgba(255,255,255,1)`, so
on any surface that isn't white (a dark Chrome toolbar, most obviously) the
icon shows up as a white square with the mark trapped inside it.

Deleting the white won't fix it. The artwork is a rounded-square *outline* with
a white interior, so clearing the background leaves almost nothing visible on a
dark toolbar. The real fix is a filled tile with a knocked-out arrow, which is a
redesign. Worth doing before publishing, since the toolbar icon is the surface
people see most.

## Version history

- **2.1.0** — Downloads moved to a service worker using `chrome.downloads`,
  which handles the cross-origin images the old `<a download>` approach
  couldn't. Notifications report what the download API actually returns instead
  of resolving on a timer.

  Native drag is suppressed through `dragstart` rather than `mousedown`, so
  clicks on linked images and site lightboxes keep working. A 300ms delay that
  gated every download is gone.

  Filenames strip the query string before checking for an extension, and
  `svg+xml`/`jpeg` map to `.svg`/`.jpg`.

  Trimmed roughly 370 lines: an unused `isCrossOrigin`, an unreachable CORS
  fallback, a stubbed background-image branch, a logging layer that needed a
  source edit to switch on, scroll and resize handlers tracking the outline
  through a sub-second drag, and null checks for things that can't happen. Both
  colors moved into the stylesheet.

- **2.0.0** — Class-based rewrite. Animations and notification styling.

- **1.0.0** — Drag to download, with a blue outline.

## License

MIT — see [LICENSE](LICENSE).
