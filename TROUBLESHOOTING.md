# 🔧 Troubleshooting Guide

## Quick Debugging Steps

### 1. **Check Extension Status**
1. Open Chrome and go to `chrome://extensions/`
2. Make sure "Nab" is **enabled**
3. Check if there are any error messages
4. Try toggling the extension off and on

### 2. **Check the right console**

Nab runs in two places, and errors surface in different consoles:

| Context | Where to look | What lives there |
|-|-|-|
| Content script | Page console (F12) | Drag detection, outline, notifications |
| Service worker | `chrome://extensions/` → Nab → "service worker" | The actual download |

If a drag produces a green outline but nothing downloads, check the **service worker** console — that's where `chrome.downloads` errors appear.

### 3. **Run Debug Script**
Paste this into the page console (F12) on any webpage:

```javascript
console.log('🔍 Nab Debug Helper');
console.log('===================');

const loaded = document.querySelector('#nab-styles');
console.log('✓ Extension loaded:', loaded ? 'YES' : 'NO');

const images = document.querySelectorAll('img');
console.log('✓ Images found on page:', images.length);

Array.from(images).slice(0, 3).forEach((img, i) => {
  console.log(`  ${i + 1}. ${(img.currentSrc || img.src).substring(0, 100)}`);
});

console.log('🔧 Try dragging an image and watch for errors');
```

## Common Issues & Solutions

### **Issue 1: No outline appears when dragging**
**Symptoms**: Clicking and dragging images does nothing

**Solutions**:
- Check the extension is enabled in `chrome://extensions/`
- Make sure you're dragging an actual `<img>` element — CSS `background-image` is unsupported
- Reload the page. Content scripts don't inject into already-open tabs after an extension reload.
- Check the page console for JavaScript errors

### **Issue 2: "Download failed" notification**
**Symptoms**: Outline turns green, then a failure notification appears

The notification includes the reason Chrome reported. Common causes:
- The image URL returns an error or has expired (common with signed CDN URLs)
- Chrome's download directory is unwritable, or a save prompt was dismissed
- The site blocks direct requests to the image URL

Check the **service worker** console for the underlying `chrome.downloads` error.

### **Issue 3: "Try reloading the page"**
**Symptoms**: That specific notification text

The service worker restarted, or the extension was reloaded while the page stayed open, so the content script lost its connection. Reload the tab.

### **Issue 4: Works on some sites but not others**
**Symptoms**: Inconsistent behavior across websites

**Possible causes**:
- **Background images**: many news and marketing sites render images via CSS, which is unsupported
- **Lazy loading**: the image may not have loaded yet
- **Custom viewers**: some sites paint images into `<canvas>` rather than `<img>`

## Testing Protocol

### **Step 1: Local test page**
Open `test.html` and work through each case — same-origin, cross-origin, query-string URL, `data:` URL, SVG, and the linked image.

### **Step 2: Verify the download landed**
Confirm the file is in your Downloads folder with a sensible filename. A success notification alone isn't proof — check the file exists. (Reporting success without checking was the exact bug fixed in v2.1.0.)

### **Step 3: Confirm normal browsing still works**
Plain-click the linked image on the test page. It should navigate. If it doesn't, Nab is interfering with page clicks — that's a bug worth reporting.

### **Step 4: Extension reload**
1. Go to `chrome://extensions/` and click reload on Nab
2. **Reload the webpage too** — required after an extension reload
3. Try again

## Getting Help

### **Reporting Issues**
Include:
- Chrome version (`chrome://version/`)
- The website URL where it fails
- Errors from **both** consoles (page and service worker)
- Whether the image is an `<img>` element or a CSS background
- Steps to reproduce

## Quick Fixes

### **Nuclear Option: Complete Reset**
1. Go to `chrome://extensions/`
2. Remove the extension completely
3. Restart Chrome
4. Reinstall the extension
5. Test with `test.html`

### **Emergency Fallback**
You can always right-click an image and choose "Save image as..." — the browser's built-in save always works. Nab is a convenience tool.
