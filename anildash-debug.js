// Debug Script for anildash.com
// Copy and paste this into the browser console on https://www.anildash.com/2025/05/22/the-crafters-of-andor/

console.log('🔍 Debugging anildash.com for Chrome Image Downloader');
console.log('=====================================================');

// Check extension status
const extensionLoaded = document.querySelector('#img-download-styles');
console.log('✓ Extension loaded:', extensionLoaded ? 'YES' : 'NO');

// Find all images on the page
const images = document.querySelectorAll('img');
console.log('✓ Total <img> elements found:', images.length);

// Also check for background images
const allElements = document.querySelectorAll('*');
const backgroundImages = [];
allElements.forEach(el => {
  const style = window.getComputedStyle(el);
  if (style.backgroundImage && style.backgroundImage !== 'none') {
    backgroundImages.push({
      element: el,
      backgroundImage: style.backgroundImage,
      tagName: el.tagName,
      className: el.className,
      id: el.id
    });
  }
});
console.log('✓ Elements with background images found:', backgroundImages.length);

if (images.length === 0 && backgroundImages.length === 0) {
  console.log('❌ No images found on page at all!');
} else {
  if (images.length > 0) {
    console.log('📋 Analyzing <img> elements:');
    
    images.forEach((img, index) => {
      console.log(`Image ${index + 1}:`, {
        tagName: img.tagName,
        src: img.src,
        currentSrc: img.currentSrc,
        alt: img.alt,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        width: img.width,
        height: img.height,
        loading: img.loading,
        className: img.className,
        id: img.id,
        hidden: img.hidden,
        style: img.style.cssText
      });
      
      // Check positioning and visibility
      const rect = img.getBoundingClientRect();
      console.log(`Image ${index + 1} position:`, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0,
        inViewport: rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
      });
      
      // Check computed styles that might interfere
      const computedStyle = window.getComputedStyle(img);
      const problematicStyles = {
        pointerEvents: computedStyle.pointerEvents,
        userSelect: computedStyle.userSelect,
        webkitUserDrag: computedStyle.webkitUserDrag,
        position: computedStyle.position,
        zIndex: computedStyle.zIndex,
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        transform: computedStyle.transform
      };
      
      console.log(`Image ${index + 1} computed styles:`, problematicStyles);
      
      // Look for blocking issues
      if (computedStyle.pointerEvents === 'none') {
        console.log(`⚠️ Image ${index + 1} has pointer-events: none - this will block mouse events!`);
      }
      if (computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
        console.log(`⚠️ Image ${index + 1} is hidden`);
      }
      if (rect.width === 0 || rect.height === 0) {
        console.log(`⚠️ Image ${index + 1} has zero dimensions`);
      }
      
      // Check for overlay elements that might be blocking
      const elementsAtPoint = document.elementsFromPoint(rect.left + rect.width/2, rect.top + rect.height/2);
      if (elementsAtPoint[0] !== img) {
        console.log(`⚠️ Image ${index + 1} is blocked by:`, elementsAtPoint[0]);
      }
      
      // Test mouse event binding
      console.log(`🧪 Setting up test for Image ${index + 1}...`);
      
      const testHandler = (e) => {
        console.log(`✅ Mouse event fired on Image ${index + 1}`);
        console.log('Event details:', {
          type: e.type,
          target: e.target,
          clientX: e.clientX,
          clientY: e.clientY,
          button: e.button
        });
        img.removeEventListener('mousedown', testHandler);
      };
      
      img.addEventListener('mousedown', testHandler);
    });
  }
  
  if (backgroundImages.length > 0) {
    console.log('📋 Background images found (extension doesn\'t support these):');
    backgroundImages.slice(0, 5).forEach((bg, index) => {
      console.log(`Background ${index + 1}:`, {
        tagName: bg.tagName,
        className: bg.className,
        id: bg.id,
        backgroundImage: bg.backgroundImage
      });
    });
    console.log('ℹ️ Note: Extension only works with <img> elements, not background images');
  }
}

// Check for lazy loading or dynamic content
console.log('🔄 Checking for lazy-loaded content...');
const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src], img[data-lazy]');
console.log('✓ Lazy-loaded images found:', lazyImages.length);

// Check for common blog platforms or CMSs that might interfere
const bodyClasses = document.body.className;
const htmlClasses = document.documentElement.className;
console.log('📝 Page classes:', { bodyClasses, htmlClasses });

// Check for any JavaScript frameworks that might interfere
const frameworks = [];
if (window.React) frameworks.push('React');
if (window.Vue) frameworks.push('Vue');
if (window.Angular) frameworks.push('Angular');
if (window.jQuery) frameworks.push('jQuery');
if (document.querySelector('[data-gatsby]')) frameworks.push('Gatsby');
if (document.querySelector('[data-next]')) frameworks.push('Next.js');
console.log('🔧 Detected frameworks:', frameworks);

// Look for Content Security Policy
const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
if (cspMeta) {
  console.log('⚠️ CSP detected:', cspMeta.content);
} else {
  console.log('✓ No CSP restrictions found');
}

console.log('=====================================================');
console.log('🔧 Troubleshooting steps:');
console.log('1. Look at the analysis above to see what images are available');
console.log('2. Check if any images have pointer-events: none');
console.log('3. Try clicking on the images listed above to test mouse events');
console.log('4. If images are background images, the extension won\'t work');
console.log('5. Look for overlay elements blocking the images');
console.log('====================================================='); 