# Nab

Drag any image to download it. No right-click, no menu, no save dialog.

Click and hold an image, pull it about an inch, let go. A blue outline follows
your cursor and turns green once you've dragged far enough. Release and the file
is in your Downloads folder.

## Install

**From the Chrome Web Store** — [submitted, awaiting
review](https://chromewebstore.google.com/detail/fgigkcbgndamdemjdbhemgndlpmamjje).
The link goes live once it's approved.

**Until then, install it manually.** Takes about a minute.

1. Download [**nab-2.1.0.zip**](https://github.com/theinstantwin/nab/releases/latest)
   and unzip it. Keep the folder somewhere permanent — Chrome loads the
   extension from it, so deleting it uninstalls Nab.
2. Open a new tab and go to `chrome://extensions`
3. Turn on the **Developer mode** toggle
4. Click **Load unpacked** and pick the unzipped folder
5. Nab appears in your extensions list. Reload any tabs you already had open.

To update later, download the newer ZIP, replace the folder's contents, and
click the refresh icon on Nab's card at `chrome://extensions`.

## About that permission warning

Chrome will say Nab can "read and change all your data on all websites." Every
extension that works on any page gets that warning, and it's worth knowing what
Nab actually does with it.

Nab watches for you dragging an image and hands that image's address to Chrome's
own download manager. That's it. It has no way to send anything anywhere: no
analytics, no account, no server, and no permission to store data. The code is
right here, and it's two files.

The alternative would be making you click a toolbar button on every page before
dragging, which is slower than just right-clicking the image.

## What it works on

Regular images, from any site, including the ones served from a CDN. Filenames
come out clean — `photo.jpg`, not `photo.jpg?w=800&q=75`.

It can't reach background images set through CSS, images drawn into a canvas,
or video. Clicking a linked image still follows the link, as it should.

If a download fails, Nab tells you why instead of failing silently.

---

## For developers

| File | Role |
|-|-|
| `manifest.json` | MV3 manifest |
| `content.js` | Drag detection, outline, notifications |
| `background.js` | Service worker — runs the download |
| `icons/` | 16/32/48/128 PNGs |

No build step, no dependencies.

### Why the download is in the service worker

Content scripts can't save cross-origin images. Chrome ignores the `download`
attribute on an `<a>` when the URL is another origin, so it navigates instead of
saving. Most images are CDN-hosted, so that path fails almost everywhere.

`chrome.downloads` has no such restriction and only runs in the service worker:

```
content.js  --{type:'nab-download', url, filename}-->  background.js
            <--------{ok, error}--------------------
```

The notification reports what comes back. A green outline means the threshold
was crossed, not that the file landed.

### Permissions

`downloads` to save the file. `content_scripts` on `<all_urls>` because the
script has to be on the page to see the drag. No `host_permissions`, no
`scripting`, no `storage`.

### Known issues

`icons/*.png` have no transparency, so the icon renders as a white square on a
dark toolbar. Clearing the white isn't enough: the artwork is an outline with a
white interior, so it needs redrawing as a filled tile.

## License

MIT
