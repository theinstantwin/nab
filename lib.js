/**
 * Page-independent logic: what to call a download, and which image a drag
 * should grab. Loaded before content.js, and required directly by the tests.
 */

const IMAGE_EXTENSION = /\.(avif|bmp|gif|heic|ico|jpe?g|png|svg|tiff?|webp)$/i;
const MAX_NAME_LENGTH = 100;

// These have mouse behavior of their own, so a drag must not reach through them.
const INTERACTIVE_TAGS = new Set(['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'VIDEO', 'CANVAS']);

/**
 * Returns the name to save an image under, or undefined to let Chrome choose.
 * Chrome reads the response's content type, so it names URLs like
 * /media/abc?format=jpg correctly where a guessed extension would be wrong.
 * @param {string} url
 * @returns {string|undefined}
 */
function filenameFor(url) {
  if (url.startsWith('data:')) {
    const mime = url.slice(5).split(/[;,]/)[0];
    return `image.${normalizeExtension(mime.split('/')[1] || 'png')}`;
  }

  let name;
  try {
    name = new URL(url).pathname.split('/').pop();
  } catch {
    return undefined;
  }

  const extension = name.match(IMAGE_EXTENSION)?.[0];
  if (!extension) return undefined;

  const safe = decodeName(name).replace(/[\\/:*?"<>|%~\x00-\x1f]/g, '_');
  const stem = safe.slice(0, -extension.length).slice(0, MAX_NAME_LENGTH - extension.length);
  return stem + extension;
}

function decodeName(name) {
  try {
    return decodeURIComponent(name);
  } catch {
    return name; // a stray % in the URL, which the character filter handles
  }
}

function normalizeExtension(subtype) {
  if (subtype === 'jpeg') return 'jpg';
  if (subtype === 'svg+xml') return 'svg';
  return subtype.replace(/[^a-z0-9]/gi, '') || 'png';
}

/**
 * Returns the image a drag starting here should grab, from the elements under
 * the cursor, topmost first. Social sites lay empty elements over their images,
 * so those are skipped, but text and controls stop the search: dragging across
 * a headline over a hero image is a text selection, not a download.
 * @param {Element[]} elements
 * @returns {HTMLImageElement|null}
 */
function imageFromStack(elements) {
  for (const element of elements) {
    if (element.tagName === 'IMG') {
      if (element.currentSrc || element.src) return element;
      continue;
    }
    if (INTERACTIVE_TAGS.has(element.tagName) || element.isContentEditable) return null;
    if (element.textContent.trim()) return null;
  }
  return null;
}

if (typeof module === 'object') module.exports = { filenameFor, imageFromStack };
