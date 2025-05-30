// Debug Helper - Run this in the browser console to check extension status
// Copy and paste this entire script into your browser's developer console

console.log('🔍 Chrome Image Downloader Debug Helper');
console.log('=====================================');

// Check if the extension is loaded
const extensionLoaded = window.ImageDownloader || document.querySelector('#img-download-styles');
console.log('✓ Extension loaded:', extensionLoaded ? 'YES' : 'NO');

// Check for images on the page
const images = document.querySelectorAll('img');
console.log('✓ Images found on page:', images.length);

if (images.length > 0) {
  console.log('📋 First few images:');
  Array.from(images).slice(0, 3).forEach((img, index) => {
    console.log(`  ${index + 1}. ${img.src.substring(0, 100)}...`);
  });
}

// Check for any existing styles
const existingStyles = document.querySelector('#img-download-styles');
console.log('✓ Extension styles injected:', existingStyles ? 'YES' : 'NO');

// Check for Content Security Policy issues
const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
if (cspMeta) {
  console.log('⚠️ CSP detected:', cspMeta.content);
} else {
  console.log('✓ No CSP restrictions found');
}

// Test basic mouse event handling
let testImage = images[0];
if (testImage) {
  console.log('🧪 Testing mouse events on first image...');
  
  // Temporarily add event listeners to test
  const testMouseDown = (e) => {
    console.log('✓ Mouse down event fired on image');
    testImage.removeEventListener('mousedown', testMouseDown);
  };
  
  testImage.addEventListener('mousedown', testMouseDown);
  console.log('💡 Try clicking on the first image to test mouse events');
}

// Check for JavaScript errors
const originalError = console.error;
console.error = function(...args) {
  console.log('🚨 JavaScript Error detected:', ...args);
  originalError.apply(console, args);
};

console.log('=====================================');
console.log('🔧 Manual Test Instructions:');
console.log('1. Try dragging any image on this page');
console.log('2. Look for a blue outline around the image');
console.log('3. Drag at least 50 pixels in any direction'); 
console.log('4. Check if the outline turns green');
console.log('5. Release to trigger download');
console.log('====================================='); 