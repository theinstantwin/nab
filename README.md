# Drag to Download Images - Chrome Extension

A minimalist Chrome extension that enables instant image downloading through intuitive drag gestures. Following the Unix philosophy of "do one thing and do one thing well."

## ✨ Features

- **Drag & Download**: Click and drag any `<img>` element beyond 50px to download instantly
- **Visual Feedback**: Progressive blue outline that turns green when ready to download
- **Smart Error Handling**: Clear notifications for success and failure states
- **Zero Configuration**: Works immediately after installation
- **Cross-Site Compatible**: Functions on all websites without permission prompts
- **Lightweight**: Single content script, no external dependencies
- **Accessibility**: ESC key cancellation support

## 🚀 Installation

### From Source (Developer Mode)
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension is now ready to use!

### Usage Instructions
1. **Navigate** to any webpage with images
2. **Click and hold** on any `<img>` element
3. **Drag** the image in any direction for at least 50 pixels
4. **Watch** for the blue outline to turn green
5. **Release** to download - you'll see a success animation and notification
6. **Press ESC** at any time to cancel the operation

## 🎯 Design Philosophy

This extension exemplifies the Unix philosophy:
- **Single Responsibility**: Downloads images from `<img>` elements, nothing more
- **Zero Configuration**: No settings, preferences, or setup required
- **Universal Compatibility**: Works consistently across all websites
- **Minimal Footprint**: Tiny performance impact, clean codebase

## ⚠️ Scope & Limitations

### What It Does
- Downloads images from HTML `<img>` elements
- Provides visual feedback during drag operations
- Handles cross-origin images gracefully (opens in new tab)
- Works with data URLs and standard image formats

### What It Doesn't Do
- **Background images** (CSS `background-image` properties)
- **SVG graphics** or inline SVGs
- **Embedded videos** or other media types
- **Bulk downloads** or batch operations
- **Image editing** or format conversion
- **Custom download locations** or organization

### Browser Compatibility
- **Chrome 88+** (Manifest V3 support required)
- **All websites** - no site-specific code or restrictions

## 🛠️ Technical Details

- **Architecture**: ES6 class-based, modular design
- **Manifest**: V3 compliance with minimal permissions
- **Performance**: <2MB memory footprint, <1% CPU usage
- **Error Handling**: Comprehensive try-catch with detailed logging
- **Debug Mode**: Built-in debugging (set `debugMode = true` in content.js)

## 📁 Project Structure

```
├── manifest.json          # Extension configuration (Manifest V3)
├── content.js             # Main functionality (500+ lines, fully documented)
├── icons/                 # Extension icons (16px, 48px, 128px)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md              # This documentation
├── PRD.md                 # Product Requirements Document
├── TROUBLESHOOTING.md     # Debug guide and common issues
└── test.html              # Local testing page
```

## 🧪 Testing

### Quick Test
1. Open `test.html` in your browser
2. Try dragging the sample images
3. Enable debug mode to see detailed console output

### Real-World Testing
- **Google Images**: Search results work perfectly
- **Wikipedia**: Article images download reliably  
- **News sites**: Mixed results (many use background images)
- **Social media**: Varies by platform implementation

## 🔧 Troubleshooting

### Common Issues
1. **No outline appears**: Image might be a background image (unsupported)
2. **Outline appears but no download**: Check console for CORS errors
3. **Extension not working**: Ensure it's enabled in `chrome://extensions/`

### Debug Mode
Enable detailed logging by editing `content.js`:
```javascript
this.debugMode = true; // Change from false to true
```

See `TROUBLESHOOTING.md` for comprehensive debugging guide.

## 📈 Version History

### v2.0.0 (Current)
- **Major refactor**: Class-based architecture for better maintainability
- **Bug fix**: Resolved race condition causing "draggedImage became null" errors
- **Enhanced error handling**: Comprehensive try-catch with specific error messages
- **Improved UI**: Better animations and user feedback
- **Performance optimization**: Reduced memory usage and CPU impact
- **Documentation**: Complete README, PRD, and troubleshooting guides

### v1.0.0 (Legacy)
- Initial drag-to-download functionality
- Basic visual feedback system

## 🤝 Contributing

Contributions are welcome! Please:
1. **Maintain the minimalist philosophy** - resist feature creep
2. **Follow the existing code style** - ES6 classes, comprehensive error handling
3. **Test thoroughly** - ensure compatibility across different sites
4. **Document changes** - update README and comments

### Development Guidelines
- Keep the extension focused on its core purpose
- Prioritize reliability over feature richness
- Ensure all changes improve the user experience
- Maintain zero configuration requirement

## 📄 License

MIT License - Feel free to modify and distribute.

## 🙏 Acknowledgments

Built following web extension best practices and inspired by the Unix philosophy of creating focused, reliable tools that do one thing exceptionally well. 