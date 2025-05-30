/**
 * Chrome Image Downloader - Content Script
 * Enables drag-to-download functionality for images on web pages
 */

class ImageDownloader {
  constructor() {
    this.isDragging = false;
    this.draggedImage = null;
    this.startPosition = { x: 0, y: 0 };
    this.outline = null;
    this.stylesInjected = false;
    this.debugMode = false; // Set to true for debugging
    
    // Configuration
    this.config = {
      minDragDistance: 50,
      animationDuration: 300,
      notificationDuration: 3000,
      outlineColor: '#2196F3',
      successColor: '#4CAF50'
    };
    
    this.init();
  }
  
  init() {
    try {
      this.log('Initializing ImageDownloader...');
      this.injectStyles();
      this.bindEvents();
      this.log('ImageDownloader initialized successfully');
    } catch (error) {
      this.logError('Failed to initialize ImageDownloader:', error);
    }
  }
  
  log(...args) {
    if (this.debugMode) {
      console.log('[ImageDownloader]', ...args);
    }
  }
  
  logError(...args) {
    console.error('[ImageDownloader]', ...args);
  }
  
  bindEvents() {
    try {
      // Use capture phase for more reliable event handling
      document.addEventListener('mousedown', this.handleMouseDown.bind(this), { passive: false, capture: true });
      document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
      document.addEventListener('mouseup', this.handleMouseUp.bind(this), { passive: true });
      document.addEventListener('keydown', this.handleKeyDown.bind(this), { passive: true });
      
      // Handle page visibility changes to cleanup properly
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      
      // Handle scroll events to update outline position
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
      window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
      
      this.log('Event listeners bound successfully');
    } catch (error) {
      this.logError('Failed to bind events:', error);
    }
  }
  
  handleMouseDown(event) {
    try {
      // More robust image detection
      let target = event.target;
      
      if (!target) {
        this.log('Event target is null, skipping');
        return;
      }
      
      // Check if target is an image or has an image as background
      if (target.tagName !== 'IMG') {
        // Check if it's a clickable element with background image
        try {
          const computedStyle = window.getComputedStyle(target);
          if (!computedStyle.backgroundImage || computedStyle.backgroundImage === 'none') {
            return;
          }
          // For background images, we'll skip for now to keep it simple
          return;
        } catch (styleError) {
          this.logError('Error checking computed style:', styleError);
          return;
        }
      }
      
      // Ensure the image has a valid source
      if (!target.src && !target.currentSrc) {
        this.log('Image has no source, skipping');
        return;
      }
      
      this.log('Mouse down on image:', target.src || target.currentSrc);
      
      this.isDragging = true;
      this.draggedImage = target;
      this.startPosition = { x: event.clientX, y: event.clientY };
      
      // Prevent default browser behavior
      event.preventDefault();
      event.stopPropagation();
      
      this.createOutline(this.draggedImage);
    } catch (error) {
      this.logError('Error in handleMouseDown:', error);
      this.logError('Event target:', event?.target);
      this.logError('Stack trace:', error.stack);
    }
  }
  
  handleMouseMove(event) {
    if (!this.isDragging || !this.draggedImage) return;
    
    try {
      const dragDistance = this.calculateDistance(event.clientX, event.clientY);
      this.updateOutline(dragDistance);
    } catch (error) {
      this.logError('Error in handleMouseMove:', error);
    }
  }
  
  handleMouseUp(event) {
    if (!this.isDragging) {
      this.cleanup();
      return;
    }
    
    try {
      const dragDistance = this.calculateDistance(event.clientX, event.clientY);
      this.log('Mouse up, drag distance:', dragDistance);
      
      if (dragDistance > this.config.minDragDistance) {
        this.log('Threshold met, downloading image...');
        this.downloadImage();
      } else {
        this.log('Threshold not met, cleaning up');
        this.cleanup();
      }
      
      this.resetState();
    } catch (error) {
      this.logError('Error in handleMouseUp:', error);
      this.cleanup();
      this.resetState();
    }
  }
  
  handleKeyDown(event) {
    // ESC key cancels the drag operation
    if (event.key === 'Escape' && this.isDragging) {
      this.log('ESC pressed, canceling drag');
      this.cleanup();
      this.resetState();
    }
  }
  
  handleVisibilityChange() {
    // Clean up if page becomes hidden
    if (document.hidden && this.isDragging) {
      this.log('Page hidden, cleaning up');
      this.cleanup();
      this.resetState();
    }
  }
  
  calculateDistance(x, y) {
    const deltaX = x - this.startPosition.x;
    const deltaY = y - this.startPosition.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
  
  createOutline(image) {
    try {
      if (!image) {
        this.logError('createOutline called with null image');
        return;
      }
      
      this.removeOutline(); // Ensure no duplicate outlines
      
      // Add more detailed logging for debugging
      this.log('Creating outline for image:', {
        tagName: image.tagName,
        src: image.src,
        currentSrc: image.currentSrc,
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight
      });
      
      const rect = image.getBoundingClientRect();
      
      if (!rect) {
        this.logError('getBoundingClientRect returned null');
        return;
      }
      
      // Check if image is visible
      if (rect.width === 0 || rect.height === 0) {
        this.log('Image not visible, skipping outline. Rect:', rect);
        return;
      }
      
      this.outline = document.createElement('div');
      if (!this.outline) {
        this.logError('Failed to create outline element');
        return;
      }
      
      this.outline.className = 'img-download-outline';
      
      // Fix positioning calculation - use fixed positioning relative to viewport
      Object.assign(this.outline.style, {
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        border: `2px solid ${this.config.outlineColor}`,
        borderRadius: '4px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
        zIndex: '2147483647', // Maximum z-index
        transition: 'all 0.1s ease'
      });
      
      if (!document.body) {
        this.logError('document.body is null');
        return;
      }
      
      document.body.appendChild(this.outline);
      this.log('Outline created successfully at:', { left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    } catch (error) {
      this.logError('Error creating outline:', error);
      this.logError('Image object:', image);
      this.logError('Stack trace:', error.stack);
    }
  }
  
  updateOutline(dragDistance) {
    if (!this.outline) return;
    
    try {
      const progress = Math.min(100, (dragDistance / this.config.minDragDistance) * 100);
      const glowIntensity = Math.min(15, progress / 6.67); // Max 15px glow
      
      if (progress >= 100) {
        this.outline.style.borderColor = this.config.successColor;
        this.outline.style.boxShadow = `0 0 0 ${glowIntensity}px rgba(76, 175, 80, 0.3)`;
      } else {
        this.outline.style.borderColor = this.config.outlineColor;
        this.outline.style.boxShadow = `0 0 0 ${glowIntensity}px rgba(33, 150, 243, 0.3)`;
      }
    } catch (error) {
      this.logError('Error updating outline:', error);
    }
  }
  
  async downloadImage() {
    if (!this.draggedImage) {
      this.logError('downloadImage called but draggedImage is null');
      return;
    }
    
    // Preserve the image reference to prevent it from becoming null during timeout
    const imageToDownload = this.draggedImage;
    
    try {
      this.log('Starting download process for:', {
        tagName: imageToDownload.tagName,
        src: imageToDownload.src,
        currentSrc: imageToDownload.currentSrc
      });
      
      this.showSuccessAnimation();
      
      setTimeout(async () => {
        try {
          // Use the preserved reference instead of this.draggedImage
          if (!imageToDownload) {
            throw new Error('Preserved image reference is null');
          }
          
          const imageUrl = imageToDownload.currentSrc || imageToDownload.src;
          
          if (!imageUrl) {
            throw new Error('No image URL found');
          }
          
          // Handle different URL types
          let downloadUrl = imageUrl;
          
          // For relative URLs, make them absolute
          if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
            downloadUrl = new URL(imageUrl, window.location.href).href;
          }
          
          const filename = this.getFilenameFromUrl(downloadUrl);
          this.log('Downloading:', downloadUrl, 'as', filename);
          
          // Create download link with better error handling
          const link = document.createElement('a');
          if (!link) {
            throw new Error('Failed to create download link');
          }
          
          link.href = downloadUrl;
          link.download = filename;
          link.style.display = 'none';
          
          // Add error event listener to catch download failures
          const downloadPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Download timeout'));
            }, 5000);
            
            link.addEventListener('error', () => {
              clearTimeout(timeout);
              reject(new Error('Download failed - link error'));
            });
            
            // Check if download started successfully
            setTimeout(() => {
              clearTimeout(timeout);
              resolve();
            }, 1000);
          });
          
          if (!document.body) {
            throw new Error('document.body is null');
          }
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Wait for download to start or fail
          await downloadPromise;
          
          this.showNotification(`✓ Downloading: ${filename}`);
          this.log('Download triggered successfully');
          
        } catch (downloadError) {
          this.logError('Download error:', downloadError);
          this.logError('Download error stack:', downloadError.stack);
          this.showNotification(`✗ Download failed: ${downloadError.message}`);
          
          // Try alternative download method for cross-origin images
          if (downloadError.message.includes('cross-origin') || downloadError.message.includes('CORS')) {
            try {
              // Use the preserved reference here too
              if (!imageToDownload) {
                throw new Error('Preserved image reference is null in fallback');
              }
              const imageUrl = imageToDownload.currentSrc || imageToDownload.src;
              window.open(imageUrl, '_blank');
              this.showNotification('🔗 Opened image in new tab - right-click to save');
            } catch (fallbackError) {
              this.logError('Fallback download also failed:', fallbackError);
              this.showNotification('✗ All download methods failed');
            }
          }
        }
      }, this.config.animationDuration);
      
    } catch (error) {
      this.logError('Download setup failed:', error);
      this.logError('Download setup error stack:', error.stack);
      this.showNotification(`✗ Download failed: ${error.message}`);
      this.cleanup();
    }
  }
  
  getFilenameFromUrl(url) {
    try {
      if (url.startsWith('data:')) {
        const mimeType = url.split(';')[0].split('/')[1] || 'png';
        return `image.${mimeType}`;
      }
      
      const urlObj = new URL(url);
      let filename = urlObj.pathname.split('/').pop() || 'image.png';
      
      // Ensure extension exists
      if (!filename.includes('.')) {
        filename += '.png';
      }
      
      // Clean filename more aggressively
      return filename.split('?')[0].replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 100);
    } catch (error) {
      this.logError('Error getting filename:', error);
      return `image_${Date.now()}.png`;
    }
  }
  
  showNotification(message) {
    try {
      // Remove existing notification if present
      const existing = document.querySelector('.img-download-notification');
      if (existing) existing.remove();
      
      const notification = document.createElement('div');
      notification.className = 'img-download-notification';
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      // Trigger entrance animation
      requestAnimationFrame(() => {
        notification.classList.add('img-download-notification--show');
      });
      
      // Auto-remove notification
      setTimeout(() => {
        if (notification.parentNode) {
          notification.classList.remove('img-download-notification--show');
          setTimeout(() => {
            if (notification.parentNode) {
              notification.remove();
            }
          }, 300);
        }
      }, this.config.notificationDuration);
    } catch (error) {
      this.logError('Error showing notification:', error);
    }
  }
  
  removeOutline() {
    try {
      if (this.outline?.parentNode) {
        this.outline.parentNode.removeChild(this.outline);
        this.outline = null;
      }
    } catch (error) {
      this.logError('Error removing outline:', error);
    }
  }
  
  cleanup() {
    this.removeOutline();
  }
  
  resetState() {
    this.isDragging = false;
    this.draggedImage = null;
    this.startPosition = { x: 0, y: 0 };
  }
  
  injectStyles() {
    if (this.stylesInjected) return;
    
    try {
      // Check if styles already exist (in case of multiple instances)
      if (document.querySelector('#img-download-styles')) {
        this.stylesInjected = true;
        return;
      }
      
      const style = document.createElement('style');
      style.id = 'img-download-styles';
      style.textContent = `
        @keyframes img-download-pulse {
          0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(76, 175, 80, 0); }
          100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
        
        .img-download-checkmark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          background: rgba(76, 175, 80, 0.9);
          border-radius: 50%;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: img-download-checkmark-appear 0.5s ease forwards;
        }
        
        @keyframes img-download-checkmark-appear {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        
        .img-download-notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 12px 16px;
          border-radius: 6px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          z-index: 2147483647;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s cubic-bezier(0.2, 0, 0.38, 0.9);
          max-width: 300px;
        }
        
        .img-download-notification--show {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      
      document.head.appendChild(style);
      this.stylesInjected = true;
      this.log('Styles injected successfully');
    } catch (error) {
      this.logError('Failed to inject styles:', error);
    }
  }
  
  handleScroll() {
    // Update outline position if dragging
    if (this.isDragging && this.draggedImage && this.outline) {
      this.updateOutlinePosition();
    }
  }
  
  handleResize() {
    // Update outline position if dragging
    if (this.isDragging && this.draggedImage && this.outline) {
      this.updateOutlinePosition();
    }
  }
  
  updateOutlinePosition() {
    if (!this.outline || !this.draggedImage) {
      this.log('updateOutlinePosition: Missing outline or draggedImage');
      return;
    }
    
    try {
      const rect = this.draggedImage.getBoundingClientRect();
      
      if (!rect) {
        this.logError('getBoundingClientRect returned null in updateOutlinePosition');
        return;
      }
      
      // Update position
      this.outline.style.left = `${rect.left}px`;
      this.outline.style.top = `${rect.top}px`;
      this.outline.style.width = `${rect.width}px`;
      this.outline.style.height = `${rect.height}px`;
      
      this.log('Outline position updated:', { left: rect.left, top: rect.top });
    } catch (error) {
      this.logError('Error updating outline position:', error);
      this.logError('Stack trace:', error.stack);
    }
  }
  
  isCrossOrigin(url) {
    try {
      const imageOrigin = new URL(url).origin;
      return imageOrigin !== window.location.origin;
    } catch {
      return false;
    }
  }
  
  showSuccessAnimation() {
    if (!this.outline) return;
    
    try {
      // Preserve the outline reference to prevent race conditions
      const outlineToAnimate = this.outline;
      
      // Update outline to success state
      outlineToAnimate.style.borderColor = this.config.successColor;
      outlineToAnimate.style.animation = 'img-download-pulse 1s forwards';
      
      // Add checkmark
      const checkmark = document.createElement('div');
      checkmark.className = 'img-download-checkmark';
      checkmark.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      outlineToAnimate.appendChild(checkmark);
      
      // Cleanup after animation with preserved reference
      setTimeout(() => {
        try {
          if (outlineToAnimate && outlineToAnimate.parentNode) {
            outlineToAnimate.parentNode.removeChild(outlineToAnimate);
          }
          // Only clear this.outline if it's still the same element
          if (this.outline === outlineToAnimate) {
            this.outline = null;
          }
        } catch (cleanupError) {
          this.logError('Error during animation cleanup:', cleanupError);
        }
      }, 1000);
    } catch (error) {
      this.logError('Error in success animation:', error);
    }
  }
}

// Initialize with better error handling and timing
try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      try {
        new ImageDownloader();
      } catch (error) {
        console.error('[ImageDownloader] Failed to initialize on DOMContentLoaded:', error);
      }
    });
  } else {
    // Add a small delay to ensure page is fully ready
    setTimeout(() => {
      try {
        new ImageDownloader();
      } catch (error) {
        console.error('[ImageDownloader] Failed to initialize:', error);
      }
    }, 100);
  }
} catch (error) {
  console.error('[ImageDownloader] Critical initialization error:', error);
}