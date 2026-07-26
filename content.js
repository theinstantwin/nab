/**
 * Nab — drag an image past the threshold to download it.
 *
 * The download itself runs in the service worker (see background.js) because
 * content scripts can't save cross-origin images.
 */

// Colors live in the stylesheet below, not here — see --nab-accent/--nab-success.
const CONFIG = {
  minDragDistance: 50,
  notificationDuration: 3000
};

class ImageDownloader {
  constructor() {
    this.draggedImage = null;
    this.startPosition = { x: 0, y: 0 };
    this.outline = null;
    this.suppressNextClick = false;

    this.injectStyles();
    this.bindEvents();
  }

  bindEvents() {
    // Capture phase so we see the event before the page, but note we never
    // preventDefault here — that would swallow clicks on linked images.
    document.addEventListener('mousedown', this.handleMouseDown.bind(this), { capture: true, passive: true });
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
    document.addEventListener('mouseup', this.handleMouseUp.bind(this), { passive: true });
    document.addEventListener('keydown', this.handleKeyDown.bind(this), { passive: true });

    // Suppressing the native ghost drag is the only default we need to cancel.
    document.addEventListener('dragstart', event => {
      if (event.target?.tagName === 'IMG') event.preventDefault();
    });

    // After a completed nab, stop a linked image from also navigating.
    document.addEventListener('click', event => {
      if (!this.suppressNextClick) return;
      this.suppressNextClick = false;
      event.preventDefault();
      event.stopPropagation();
    }, { capture: true });
  }

  handleMouseDown(event) {
    const target = event.target;
    if (target?.tagName !== 'IMG') return;
    if (!target.currentSrc && !target.src) return;

    this.draggedImage = target;
    this.startPosition = { x: event.clientX, y: event.clientY };
    this.createOutline(target);
  }

  handleMouseMove(event) {
    if (!this.draggedImage) return;
    this.updateOutline(this.dragDistance(event));
  }

  handleMouseUp(event) {
    if (!this.draggedImage) return;

    const image = this.draggedImage;
    const passedThreshold = this.dragDistance(event) > CONFIG.minDragDistance;
    this.draggedImage = null;

    if (!passedThreshold) {
      this.removeOutline();
      return;
    }

    this.suppressNextClick = true;
    this.showSuccessAnimation();
    this.download(image);
  }

  handleKeyDown(event) {
    if (event.key !== 'Escape' || !this.draggedImage) return;
    this.draggedImage = null;
    this.removeOutline();
  }

  dragDistance({ clientX, clientY }) {
    const deltaX = clientX - this.startPosition.x;
    const deltaY = clientY - this.startPosition.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  async download(image) {
    const url = image.currentSrc || image.src;
    const filename = this.filenameFor(url);

    try {
      const result = await chrome.runtime.sendMessage({ type: 'nab-download', url, filename });
      if (result?.ok) {
        this.showNotification(`✓ Downloading: ${filename}`);
      } else {
        this.showNotification(`✗ Download failed: ${result?.error ?? 'unknown error'}`);
      }
    } catch (error) {
      // Fires if the service worker is unreachable (e.g. the extension was
      // reloaded while this page stayed open).
      console.warn('[Nab] Download request failed:', error);
      this.showNotification('✗ Download failed — try reloading the page');
    }
  }

  filenameFor(url) {
    // Untested: whether chrome.downloads accepts data: URLs at all — Chrome's
    // docs don't say. If it rejects them, this branch is dead code.
    if (url.startsWith('data:')) {
      const mime = url.slice(5).split(/[;,]/)[0];
      const subtype = mime.split('/')[1] || 'png';
      return `image.${this.normalizeExtension(subtype)}`;
    }

    try {
      // pathname excludes the query string, so there's nothing to strip after.
      const name = new URL(url).pathname.split('/').pop() || 'image';
      const safe = name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 100);
      return safe.includes('.') ? safe : `${safe}.png`;
    } catch {
      return `image_${Date.now()}.png`;
    }
  }

  normalizeExtension(subtype) {
    if (subtype === 'jpeg') return 'jpg';
    if (subtype === 'svg+xml') return 'svg';
    return subtype.replace(/[^a-z0-9]/gi, '') || 'png';
  }

  createOutline(image) {
    this.removeOutline();

    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    this.outline = document.createElement('div');
    this.outline.className = 'nab-outline';
    this.outline.style.left = `${rect.left}px`;
    this.outline.style.top = `${rect.top}px`;
    this.outline.style.width = `${rect.width}px`;
    this.outline.style.height = `${rect.height}px`;
    document.body.appendChild(this.outline);
  }

  updateOutline(dragDistance) {
    if (!this.outline) return;

    const progress = Math.min(1, dragDistance / CONFIG.minDragDistance);
    this.outline.style.setProperty('--nab-glow', `${progress * 15}px`);
    this.outline.classList.toggle('nab-outline--ready', progress === 1);
  }

  removeOutline() {
    this.outline?.remove();
    this.outline = null;
  }

  showSuccessAnimation() {
    if (!this.outline) return;

    const outline = this.outline;
    this.outline = null; // hand ownership to the animation

    outline.classList.add('nab-outline--ready');
    outline.style.animation = 'nab-pulse 1s forwards';

    const checkmark = document.createElement('div');
    checkmark.className = 'nab-checkmark';
    checkmark.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    outline.appendChild(checkmark);

    setTimeout(() => outline.remove(), 1000);
  }

  showNotification(message) {
    document.querySelector('.nab-notification')?.remove();

    const notification = document.createElement('div');
    notification.className = 'nab-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    requestAnimationFrame(() => notification.classList.add('nab-notification--show'));

    setTimeout(() => {
      notification.classList.remove('nab-notification--show');
      setTimeout(() => notification.remove(), 300);
    }, CONFIG.notificationDuration);
  }

  injectStyles() {
    if (document.querySelector('#nab-styles')) return;

    const style = document.createElement('style');
    style.id = 'nab-styles';
    style.textContent = `
      /*
       * Every color Nab uses is defined once, here. The drag handler writes
       * only --nab-glow; crossing the threshold just adds --ready, which
       * repoints --nab-active at the success color.
       */
      .nab-outline {
        --nab-accent: 33, 150, 243;
        --nab-success: 76, 175, 80;
        --nab-active: var(--nab-accent);
        --nab-glow: 0px;

        position: fixed;
        border: 2px solid rgb(var(--nab-active));
        box-shadow: 0 0 0 var(--nab-glow) rgba(var(--nab-active), 0.3);
        border-radius: 4px;
        box-sizing: border-box;
        pointer-events: none;
        z-index: 2147483647;
        transition: border-color 0.1s ease, box-shadow 0.1s ease;
      }

      .nab-outline--ready {
        --nab-active: var(--nab-success);
      }

      @keyframes nab-pulse {
        0% { box-shadow: 0 0 0 0 rgba(var(--nab-success), 0.7); }
        70% { box-shadow: 0 0 0 15px rgba(var(--nab-success), 0); }
        100% { box-shadow: 0 0 0 0 rgba(var(--nab-success), 0); }
      }

      .nab-checkmark {
        position: absolute;
        top: 50%;
        left: 50%;
        background: rgba(var(--nab-success), 0.9);
        border-radius: 50%;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: nab-checkmark-appear 0.5s ease forwards;
      }

      @keyframes nab-checkmark-appear {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }

      .nab-notification {
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
        transition: opacity 0.3s cubic-bezier(0.2, 0, 0.38, 0.9), transform 0.3s cubic-bezier(0.2, 0, 0.38, 0.9);
        max-width: 300px;
      }

      .nab-notification--show {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }
}

new ImageDownloader();
