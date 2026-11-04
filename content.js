/**
 * Nab — drag an image past the threshold to download it.
 *
 * The download itself runs in the service worker (see background.js) because
 * content scripts can't save cross-origin images.
 */

// Colors live in content.css, not here: see --nab-accent/--nab-success.
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

    this.bindEvents();
  }

  bindEvents() {
    // Capture phase so we see the event before the page, but note we never
    // preventDefault here — that would swallow clicks on linked images.
    document.addEventListener('mousedown', this.handleMouseDown.bind(this), { capture: true, passive: true });
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { capture: true, passive: true });
    document.addEventListener('mouseup', this.handleMouseUp.bind(this), { capture: true, passive: true });
    document.addEventListener('keydown', this.handleKeyDown.bind(this), { passive: true });
    window.addEventListener('blur', () => this.cancelDrag());

    // Suppressing the native ghost drag is the only default we need to cancel.
    document.addEventListener('dragstart', event => {
      if (this.draggedImage) event.preventDefault();
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
    // Ctrl+click opens the context menu on a Mac, like a right click.
    if (event.button !== 0 || event.ctrlKey) return;

    const image = imageFromStack(document.elementsFromPoint(event.clientX, event.clientY));
    if (!image) return;

    this.draggedImage = image;
    this.startPosition = { x: event.clientX, y: event.clientY };
    this.createOutline(image);
  }

  handleMouseMove(event) {
    if (!this.draggedImage) return;

    // A release outside the window never reaches us, so this is the first sign.
    if (!(event.buttons & 1)) {
      this.cancelDrag();
      return;
    }

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
    if (event.key === 'Escape') this.cancelDrag();
  }

  cancelDrag() {
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
    const filename = filenameFor(url);

    try {
      const result = await chrome.runtime.sendMessage({ type: 'nab-download', url, filename });
      if (result?.ok) {
        this.showNotification(`✓ Downloading: ${filename ?? 'image'}`);
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
}

new ImageDownloader();
