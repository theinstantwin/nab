# Nab

Chrome extension. Drag any image past 50 pixels and it saves to your Downloads
folder.

- **Store listing:** not yet submitted
- **Extension ID:** assigned by the store on first publish
- **Status:** unpublished — loaded unpacked for development

## Layout

| File | Role |
|-|-|
| `manifest.json` | MV3 manifest |
| `content.js` | Drag detection, the outline, notifications |
| `background.js` | Service worker — performs the download |
| `test.html` | Local test page; not shipped |
| `icons/` | 16/32/48/128 PNGs |

No build step. Two plain JS files, no dependencies.

## Why the download lives in the service worker

A content script can't save a cross-origin image. Chrome ignores the `download`
attribute on an `<a>` element when the URL points at another origin, so the
click either navigates or opens a tab. Most images on the web come from a CDN,
which meant the obvious approach failed on most of the web.

`chrome.downloads` has no such restriction, and it only runs in the service
worker. So `content.js` watches the drag and `background.js` does the saving:

```
content.js  --{type:'nab-download', url, filename}-->  background.js
content.js  <--------{ok, error}---------------------  chrome.downloads.download()
```

The notification reports what the service worker sends back. A green outline
means the threshold was crossed, not that the file arrived.

## The drag

`mousedown` on an `<img>` records the start point and draws a fixed-position
outline. `mousemove` grows a glow from 0 to 15px as you approach 50px. Cross the
threshold and the outline turns green. Release and it downloads. Escape cancels.

Nab never calls `preventDefault()` on `mousedown`. That's tempting, since it's
what suppresses the browser's native ghost-drag, but it fires before you know
whether the user is dragging or clicking, so it swallows ordinary clicks. Linked
thumbnails stop navigating, and site lightboxes never see the event. Handling
`dragstart` instead suppresses the ghost image and nothing else, because
`dragstart` only fires once a drag genuinely begins.

A completed drag does swallow the trailing `click`, so nabbing a linked thumbnail
doesn't also follow the link.

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

Whether `chrome.downloads` accepts `data:` URLs at all is untested — Chrome's
documentation doesn't say. Drag one of the Test 1 images on `test.html` to find
out; if it fails, that branch is dead code worth deleting.

## What it doesn't handle

CSS `background-image`, inline `<svg>` elements, `<canvas>`, videos, and bulk
selection. An `.svg` file loaded through `<img>` works fine.

## Permissions

| Permission | Why |
|-|-|
| `downloads` | Saves the file. The whole point. |
| `content_scripts` matching `<all_urls>` | The script has to be on the page to see the drag. |

No `host_permissions`, no `scripting`, no `storage`. Nab makes no network
requests, stores nothing, and sends nothing anywhere.

## Testing

Load unpacked at `chrome://extensions`, then open `test.html` and work through
the six cases. The cross-origin one matters most — that's the case a content
script can't handle on its own.

Confirm the file lands in Downloads. A success notification alone isn't proof.

## When something doesn't work

Nab runs in two places and they log to different consoles. Drag behavior shows
up in the page console (F12); download failures show up in the service worker
console, reached from `chrome://extensions` → Nab → "service worker".

| Symptom | Cause |
|-|-|
| No outline at all | The image is a CSS background, or the page was open before the extension loaded — reload it |
| "Download failed", with a reason | Chrome rejected the URL. The reason comes from `chrome.downloads`; the service worker console has the detail |
| "Try reloading the page" | The service worker restarted and the content script lost its connection. Reload the tab |
| Works on some sites, not others | Background images, lazy-loaded images that haven't arrived yet, or sites painting into `<canvas>` |

To confirm the content script is live on a page, check for its stylesheet:

```javascript
document.querySelector('#nab-styles')   // null means it didn't inject
```

## Releasing

1. Bump `version` in `manifest.json` (Chrome rejects re-uploads at the same version).
2. Zip the folder **contents**, not the folder:
   ```bash
   cd projects/nab
   zip -r ../nab-$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])").zip . \
     -x '*.DS_Store' -x '.gitignore' -x 'LICENSE' -x 'README.md' \
     -x 'chrome-web-store.md' -x 'STORE-LISTING.md' -x 'test.html' -x '.git/*'
   ```
3. Upload at [the developer console](https://chrome.google.com/webstore/devconsole) → the item → Package.
4. Tag the release: `git tag -a v2.1.0 -m "..."`.

`name` in the manifest sets the public store title, so it must stay **Nab** once
published or the listing renames itself on upload. Submission mechanics and
listing copy are in `chrome-web-store.md` and `STORE-LISTING.md`.

## Version history

- **2.1.0** — Downloads moved to a service worker using `chrome.downloads`,
  which handles the cross-origin images the previous `<a download>` approach
  couldn't. Notifications now report the result the download API returns rather
  than resolving on a timer.

  Native drag is suppressed through `dragstart` instead of `mousedown`, so
  clicks on linked images and site lightboxes keep working. A 300ms delay that
  gated each download is gone.

  Filenames strip the query string before checking for an extension, and
  `svg+xml`/`jpeg` map to `.svg`/`.jpg`.

  Trimmed roughly 370 lines: an unused `isCrossOrigin`, an unreachable CORS
  fallback, a stubbed background-image branch, a logging layer that needed a
  source edit to switch on, scroll and resize handlers tracking the outline
  through a sub-second drag, and null checks for conditions that can't occur.
  Both colors now live in the stylesheet.

- **2.0.0** — Class-based rewrite. Animations and notification styling.

- **1.0.0** — Drag to download, with a blue outline.

## License

MIT — see [LICENSE](LICENSE).
