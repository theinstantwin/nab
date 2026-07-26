# Nab - Drag to Download Images

A Chrome extension that makes downloading images effortless. Just drag any image to download it instantly.

## ✨ Features

- **Drag & Download**: Click and drag any image beyond 50px to download instantly
- **Visual Feedback**: Blue outline that turns green when ready to download
- **Works cross-origin**: Downloads CDN-hosted images, not just same-origin ones
- **Honest notifications**: Success and failure messages reflect the actual download result
- **Zero Setup**: Works immediately after installation
- **Stays out of the way**: Clicking a linked image still follows the link
- **Lightweight**: One content script, one small service worker, no dependencies
- **Accessible**: ESC key cancellation support

## 🚀 Quick Start

### Installation
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. Start dragging images to download them!

### How to Use
1. **Navigate** to any webpage with images
2. **Click and hold** on any image
3. **Drag** the image in any direction for at least 50 pixels
4. **Watch** for the blue outline to turn green
5. **Release** to download - you'll see a success animation and notification
6. **Press ESC** at any time to cancel

Clicking an image without dragging does nothing, so links and lightboxes behave normally.

## 🎯 What It Does

### Supported
- Downloads images from HTML `<img>` elements
- Cross-origin and same-origin images alike
- `.svg` files loaded via `<img src="...">`
- `data:` URLs
- Responsive images (`srcset` / `<picture>`) — grabs the variant the browser actually rendered
- Strips query strings from filenames (`photo.jpg?w=800` saves as `photo.jpg`)

### Not Supported
- **Background images** (CSS `background-image` properties)
- **Inline `<svg>` elements** (as opposed to `.svg` files in an `<img>`)
- **Videos** or other media types
- **Bulk downloads** or batch operations

## 🛠️ Technical Details

- **Architecture**: ES6 class in a content script, plus a service worker for downloads
- **Manifest**: V3, one permission (`downloads`)
- **Downloads**: handled by `chrome.downloads` in the service worker. A content script can't do this itself — the `download` attribute on an `<a>` element is ignored for cross-origin URLs, which is most images on the web.
- **Native drag**: suppressed via `dragstart`, so the browser's ghost-drag doesn't fight the outline

### How the download works

```
content.js  --{type:'nab-download', url, filename}-->  background.js
content.js  <--------{ok, error}---------------------  chrome.downloads.download()
```

The notification shows whatever the service worker actually reports.

## 📁 Project Structure

```
├── manifest.json          # Extension configuration
├── content.js             # Drag detection, outline, notifications
├── background.js          # Service worker — performs the download
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── README.md              # This documentation
├── TROUBLESHOOTING.md     # Debug guide
└── test.html              # Local testing page
```

## 🧪 Testing

### Quick Test
Open `test.html` in your browser and work through the cases: same-origin, cross-origin, query-string URLs, `data:` URLs, SVG, and a linked image (which should still navigate on a plain click).

### What to check
- The file lands in your Downloads folder with a sensible filename
- Cross-origin images save rather than opening in a tab
- A plain click on a linked image still follows the link

## 🔧 Troubleshooting

### Common Issues
1. **No outline appears**: the image is probably a CSS background image (unsupported)
2. **"Download failed" notification**: the message includes the reason reported by Chrome
3. **"Try reloading the page"**: the service worker restarted; reload the tab to reconnect
4. **Extension not working**: ensure it's enabled in `chrome://extensions/`

See `TROUBLESHOOTING.md` for the full debugging guide.

## 📈 Version History

### v2.1.0 (Current)
- **Fixed cross-origin downloads**: moved the download to a service worker using `chrome.downloads`. The previous `<a download>` approach silently failed for CDN-hosted images — which is most of the web. The declared `downloads` permission was never actually used.
- **Fixed false success reports**: the old completion check resolved on a 1-second timer regardless of outcome, so every drag reported success. Notifications now reflect the real result.
- **Stopped hijacking clicks**: `mousedown` no longer calls `preventDefault`/`stopPropagation` on every image, which had broken navigation on linked thumbnails and blocked site lightboxes. Native drag is suppressed via `dragstart` instead.
- **Fixed filenames**: query strings are stripped before the extension check; `svg+xml` and `jpeg` map to `.svg` and `.jpg`.
- **Removed 300ms download delay** that existed only to wait for an animation.
- **Deleted ~370 lines**: dead code (an unused `isCrossOrigin`, an unreachable CORS fallback, a stubbed background-image branch), a logging layer that required editing source to enable, scroll/resize handlers that tracked the outline during a sub-second drag, and defensive checks for conditions that cannot occur.

### v2.0.0
- **Major refactor**: Class-based architecture for better maintainability
- **Improved UI**: Better animations and user feedback
- **Documentation**: Complete guides and troubleshooting

### v1.0.0 (Legacy)
- Initial drag-to-download functionality
- Basic visual feedback system

## 🤝 Contributing

Contributions are welcome! Please:
1. **Keep it simple** - maintain the focused approach
2. **Follow the existing code style** - ES6 classes, no dependencies
3. **Test thoroughly** - ensure compatibility across different sites
4. **Document changes** - update README and comments

### Development Guidelines
- Keep the extension focused on its core purpose
- Prioritize reliability over feature richness
- Guard against failures that can actually happen; skip the rest
- Maintain zero configuration requirement

## 📄 License

MIT License - see [LICENSE](LICENSE).
