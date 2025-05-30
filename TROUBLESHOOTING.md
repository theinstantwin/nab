# 🔧 Troubleshooting Guide

## Quick Debugging Steps

### 1. **Check Extension Status**
1. Open Chrome and go to `chrome://extensions/`
2. Make sure "Drag to Download Images" is **enabled**
3. Check if there are any error messages
4. Try toggling the extension off and on

### 2. **Enable Debug Mode**
To see detailed logs of what the extension is doing:

1. Open the `content.js` file
2. Change line 12 from:
   ```javascript
   this.debugMode = false; // Set to true for debugging
   ```
   to:
   ```javascript
   this.debugMode = true; // Set to true for debugging
   ```
3. Reload the extension in Chrome
4. Open browser console (F12) and check for `[ImageDownloader]` messages

### 3. **Run Debug Script**
Copy and paste this script into your browser console (F12) on any webpage:

```javascript
// Debug Helper - Copy and paste this into browser console
console.log('🔍 Chrome Image Downloader Debug Helper');
console.log('=====================================');

const extensionLoaded = document.querySelector('#img-download-styles');
console.log('✓ Extension loaded:', extensionLoaded ? 'YES' : 'NO');

const images = document.querySelectorAll('img');
console.log('✓ Images found on page:', images.length);

if (images.length > 0) {
  console.log('📋 First few images:');
  Array.from(images).slice(0, 3).forEach((img, index) => {
    console.log(`  ${index + 1}. ${img.src.substring(0, 100)}...`);
  });
}

console.log('🔧 Try dragging any image and watch console for errors');
```

## Common Issues & Solutions

### **Issue 1: No outline appears when dragging**
**Symptoms**: Clicking and dragging images does nothing

**Solutions**:
- Check if the extension is enabled in `chrome://extensions/`
- Make sure you're dragging an actual `<img>` element (not background images)
- Try refreshing the page
- Check browser console for JavaScript errors

### **Issue 2: Outline appears but download doesn't work**
**Symptoms**: Blue outline shows, turns green, but no download happens

**Solutions**:
- Check if the image source is valid (not broken)
- Try with images from the same domain first
- Look for Content Security Policy (CSP) restrictions
- Check Downloads settings in Chrome

### **Issue 3: Extension works on some sites but not others**
**Symptoms**: Inconsistent behavior across websites

**Possible Causes**:
- **CSP Restrictions**: Some sites block content script injection
- **Lazy Loading**: Images might not be fully loaded
- **JavaScript Conflicts**: Other scripts interfering
- **Custom Image Handling**: Sites with special image viewers

**Solutions**:
- Try on simple sites like Google Images first
- Check browser console for error messages
- Disable other extensions temporarily

### **Issue 4: Cross-origin image problems**
**Symptoms**: Downloads fail for images from other domains

**This is expected behavior**:
- Modern browsers restrict downloading cross-origin images
- The extension will try to open the image in a new tab instead
- You can then right-click and save from there

## Testing Protocol

### **Step 1: Basic Test**
1. Go to [Google Images](https://images.google.com)
2. Search for any image
3. Try dragging one of the search result images
4. Should see blue outline → green outline → download

### **Step 2: Console Check**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for any red error messages
4. Try the drag operation again
5. Watch for `[ImageDownloader]` messages (if debug mode enabled)

### **Step 3: Extension Reload**
1. Go to `chrome://extensions/`
2. Find "Drag to Download Images"
3. Click the refresh/reload button
4. Try again on the webpage

## Getting Help

If the extension still isn't working:

1. **Check Console Errors**: Open F12 → Console, look for red errors
2. **Test Multiple Sites**: Try Google Images, Wikipedia, etc.
3. **Check Chrome Version**: Make sure you're on Chrome 88+
4. **Restart Chrome**: Sometimes helps with extension issues

### **Reporting Issues**
Include this information:
- Chrome version (`chrome://version/`)
- Website URL where it's not working
- Console error messages (if any)
- Whether debug mode shows any `[ImageDownloader]` messages
- Steps to reproduce the issue

## Quick Fixes

### **Nuclear Option: Complete Reset**
1. Go to `chrome://extensions/`
2. Remove the extension completely
3. Restart Chrome
4. Reinstall the extension
5. Test on Google Images

### **Emergency Fallback**
If nothing works, you can always:
1. Right-click any image
2. Select "Save image as..."
3. Choose location and save

The extension is just a convenience tool - the browser's built-in save function always works! 