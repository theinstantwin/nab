# Nab

Chrome extension. Drag an image 50px and it downloads.

## Files

| File | Role |
|-|-|
| `manifest.json` | MV3 manifest |
| `content.js` | Drag detection, outline, notifications |
| `background.js` | Service worker — runs the download |
| `icons/` | 16/32/48/128 PNGs |

No build step, no dependencies. Load unpacked at `chrome://extensions`.

## Why the download is in the service worker

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

## Permissions

`downloads` to save the file. `content_scripts` on `<all_urls>` because the
script has to be on the page to see the drag. No `host_permissions`, no
`scripting`, no `storage`.

## Known issues

`icons/*.png` have no transparency, so the icon renders as a white square on a
dark toolbar. Clearing the white isn't enough: the artwork is an outline with a
white interior, so it needs redrawing as a filled tile.

## License

MIT
