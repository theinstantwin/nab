# Chrome Web Store submission

Publisher: matt.desiena (ID `021959ca-7078-4a15-a1e3-24808b0ed9c9`), contact pinpointpc@gmail.com

- **Item:** Nab
- **Extension ID:** assigned on first upload — record it here once it exists
- **Status:** not yet submitted
- **Category:** Tools · **Language:** English

## The listing title comes from the package

The store shows `name` from `manifest.json`. Once published it must stay **Nab**
— changing it renames the public listing on the next upload.

`description` in the manifest is a fallback the store shows in some surfaces. It
currently reads "Instantly download images by dragging them. Simple, fast, and
intuitive." Keep it under 132 characters.

## Do not add a `key` field

The store assigns the ID and re-signs every upload. A `key` field only pins the
ID for locally-loaded unpacked builds, and pasting one into a published item's
manifest causes more confusion than it solves.

## Single purpose

The store requires one stated purpose per item. Nab's:

> Download images from web pages by dragging them.

That's the entire extension — one content script watching for a drag, one
service worker calling `chrome.downloads`. No secondary features to explain
away, which is the easiest version of this declaration to defend.

## Permission justifications

Paste these into the Privacy tab.

**`downloads`**

> Saves the dragged image to the user's Downloads folder. This is the extension's
> only function. A content script cannot save a cross-origin image — Chrome
> ignores the `download` attribute on an anchor when the URL points at another
> origin — so the download runs through `chrome.downloads` in the service worker.

**Content script matching `<all_urls>`**

> The extension detects a mouse drag on an image element, so its content script
> must run on the page where the image is. Users expect to drag an image on any
> site they visit, the same way the browser's own "Save image as" works
> everywhere. The script only listens for mouse and drag events on `<img>`
> elements and sends the image URL to the extension's own service worker. It
> reads no page text, no form fields, no cookies, and makes no network requests.

**Remote code**

> No. Both scripts ship in the package. No `eval`, no external scripts, no CDN.

**Data collection**

> None. The extension has no `storage` permission, no analytics, no telemetry,
> and no server. Nothing leaves the browser except the download request Chrome
> itself performs.

### Note on the warning users see

`content_scripts.matches` triggers the same install-time warning as
`host_permissions` does — "Read and change all your data on all websites."
That's unavoidable for a drag-anywhere tool and shouldn't be worked around by
adding permissions that don't help.

`activeTab` + `scripting` would remove the warning but breaks the product: the
user would have to click the toolbar icon on every page before dragging, which
is slower than right-click → Save image as. Reviewers routinely approve
always-on extensions in this category when the single purpose is coherent and no
data is collected. Both are true here.

Nab requests no `host_permissions` and no `scripting`. Don't add either — they
widen the warning without enabling anything.

## Required listing assets

| Asset | Spec | Status |
|-|-|-|
| Store icon | 128×128 PNG | have it — `icons/icon128.png` |
| Screenshot | 1280×800, at least one, up to five | needed |
| Small promo tile | 440×280 PNG or JPEG | needed |
| Marquee promo tile | 1400×560 | optional |
| Promo video | YouTube link | optional |

The screenshot is the one real gap. Nab is a motion-based tool, and a still
frame of a blue rectangle explains nothing — annotate the shot with the drag
path and the resulting download, or shoot the moment the outline turns green.

Listing prose lives in `STORE-LISTING.md`, paste-ready. The dashboard isn't
version-controlled and can't be diffed, so update that file whenever the live
description changes.

## Publishing an update

1. Bump `version` in `manifest.json` — the store rejects a re-upload at the same
   version. A version burns once *uploaded*, not once published, so a rejected
   or abandoned draft still consumes its number.
2. Zip the folder contents (command in `README.md`).
3. Developer console → the item → **Package** → upload the zip.
4. Re-check **Privacy practices** if permissions changed.
5. Submit for review. Review usually takes a few days. Rollout to existing users
   is gradual.

Extensions requesting broad host access sometimes draw a longer review than
single-domain ones. Budget for that on the first submission rather than
scheduling anything around the publish date.
