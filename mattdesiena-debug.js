// Debug Script for mattdesiena.com
// Copy and paste this into the browser console on https://mattdesiena.com/

console.log('🔍 Debugging mattdesiena.com for Chrome Image Downloader');
console.log('=====================================================');

// Check extension status
const extensionLoaded = document.querySelector('#img-download-styles');
console.log('✓ Extension loaded:', extensionLoaded ? 'YES' : 'NO');

// Find all images on the page
const images = document.querySelectorAll('img');
console.log('✓ Total images found:', images.length);

if (images.length === 0) {
  console.log('❌ No images found on page!');
} else {
  console.log('📋 Analyzing first image (the one causing issues):');
  
  const firstImage = images[0];
  
  // Detailed analysis of the first image
  console.log('Image details:', {
    tagName: firstImage.tagName,
    src: firstImage.src,
    currentSrc: firstImage.currentSrc,
    alt: firstImage.alt,
    complete: firstImage.complete,
    naturalWidth: firstImage.naturalWidth,
    naturalHeight: firstImage.naturalHeight,
    width: firstImage.width,
    height: firstImage.height,
    loading: firstImage.loading,
    crossOrigin: firstImage.crossOrigin,
    className: firstImage.className,
    id: firstImage.id
  });
  
  // Check image positioning
  const rect = firstImage.getBoundingClientRect();
  console.log('Image position:', {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    visible: rect.width > 0 && rect.height > 0
  });
  
  // Check if image is actually loaded
  if (firstImage.complete && firstImage.naturalWidth > 0) {
    console.log('✅ Image is fully loaded');
  } else if (firstImage.complete && firstImage.naturalWidth === 0) {
    console.log('❌ Image failed to load');
  } else {
    console.log('⏳ Image is still loading');
  }
  
  // Check parent elements
  console.log('Image parent chain:');
  let parent = firstImage.parentElement;
  let level = 1;
  while (parent && level <= 5) {
    console.log(`  ${level}: ${parent.tagName}${parent.className ? '.' + parent.className : ''}${parent.id ? '#' + parent.id : ''}`);
    parent = parent.parentElement;
    level++;
  }
  
  // Test mouse event binding
  console.log('🧪 Testing mouse event on first image...');
  
  // Create a test event handler
  const testHandler = (e) => {
    console.log('✅ Mouse event fired successfully');
    console.log('Event details:', {
      type: e.type,
      target: e.target,
      clientX: e.clientX,
      clientY: e.clientY,
      button: e.button
    });
    firstImage.removeEventListener('mousedown', testHandler);
  };
  
  firstImage.addEventListener('mousedown', testHandler);
  console.log('💡 Click on the first image to test mouse events');
  
  // Check for conflicting event listeners
  console.log('Checking for potential conflicts...');
  
  // Check if image has any special attributes that might interfere
  const problematicAttributes = ['draggable', 'onmousedown', 'onclick', 'ondrag'];
  problematicAttributes.forEach(attr => {
    if (firstImage.hasAttribute(attr)) {
      console.log(`⚠️ Found potentially conflicting attribute: ${attr}="${firstImage.getAttribute(attr)}"`);
    }
  });
  
  // Check computed styles for any unusual properties
  const computedStyle = window.getComputedStyle(firstImage);
  const relevantStyles = {
    pointerEvents: computedStyle.pointerEvents,
    userSelect: computedStyle.userSelect,
    webkitUserDrag: computedStyle.webkitUserDrag,
    position: computedStyle.position,
    zIndex: computedStyle.zIndex,
    display: computedStyle.display,
    visibility: computedStyle.visibility,
    opacity: computedStyle.opacity
  };
  
  console.log('Image computed styles:', relevantStyles);
  
  // Look for any unusual styles that might block interaction
  if (computedStyle.pointerEvents === 'none') {
    console.log('⚠️ Image has pointer-events: none - this will block mouse events!');
  }
  if (computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
    console.log('⚠️ Image is hidden - this might cause issues');
  }
}

// Check for any JavaScript errors that might have occurred
console.log('Monitoring for JavaScript errors...');
const originalError = console.error;
console.error = function(...args) {
  console.log('🚨 JavaScript Error detected:', ...args);
  originalError.apply(console, args);
};

console.log('=====================================================');
console.log('🔧 Next steps:');
console.log('1. Enable debug mode in content.js (set debugMode = true)');
console.log('2. Reload the extension');
console.log('3. Try dragging the first image');
console.log('4. Watch console for [ImageDownloader] messages');
console.log('5. Look for the specific line where "cannot read properties of null" occurs');
console.log('====================================================='); 