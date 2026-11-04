/**
 * Unit tests for the page-independent logic in lib.js. The drag handling needs
 * a real browser, so these cover filenames and image hit-testing only.
 * Run with: node --test
 */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { filenameFor, imageFromStack } = require('../lib.js');

test('keeps a plain image name', () => {
  assert.equal(filenameFor('https://cdn.example.com/a/photo.jpg'), 'photo.jpg');
});

test('ignores the query string', () => {
  assert.equal(filenameFor('https://cdn.example.com/photo.jpg?w=800&q=75'), 'photo.jpg');
});

test('decodes percent-encoded names', () => {
  assert.equal(filenameFor('https://example.com/my%20photo.jpg'), 'my photo.jpg');
});

test('keeps non-English names', () => {
  assert.equal(filenameFor('https://example.com/%E5%86%99%E7%9C%9F.png'), '写真.png');
});

test('survives a malformed percent sequence', () => {
  assert.equal(filenameFor('https://example.com/100%.jpg'), '100_.jpg');
});

test('replaces characters that are unsafe in filenames', () => {
  assert.equal(filenameFor('https://example.com/a%3Ab%2Fc.png'), 'a_b_c.png');
});

test('shortens long names but keeps the extension', () => {
  const name = filenameFor(`https://example.com/${'a'.repeat(300)}.webp`);
  assert.equal(name.length, 100);
  assert.ok(name.endsWith('.webp'));
});

test('leaves the name to Chrome when the URL has no extension', () => {
  assert.equal(filenameFor('https://pbs.example.com/media/abc?format=jpg'), undefined);
});

test('leaves the name to Chrome when the extension is not an image type', () => {
  assert.equal(filenameFor('https://example.com/image.php?id=4'), undefined);
});

test('leaves the name to Chrome for blob URLs', () => {
  assert.equal(filenameFor('blob:https://example.com/0f3a-11'), undefined);
});

test('names data URLs from their MIME type', () => {
  assert.equal(filenameFor('data:image/jpeg;base64,AAAA'), 'image.jpg');
  assert.equal(filenameFor('data:image/svg+xml,<svg/>'), 'image.svg');
});

const img = (src = '/a.jpg') => ({ tagName: 'IMG', currentSrc: src, src, textContent: '' });
const box = (text = '', tagName = 'DIV') => ({ tagName, textContent: text });

test('finds the image directly under the cursor', () => {
  const image = img();
  assert.equal(imageFromStack([image, box()]), image);
});

test('finds an image beneath an empty overlay', () => {
  const image = img();
  assert.equal(imageFromStack([box(), box(), image]), image);
});

test('stops at an element with text', () => {
  assert.equal(imageFromStack([box('Headline'), img()]), null);
});

test('stops at interactive elements', () => {
  for (const tag of ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'VIDEO', 'CANVAS']) {
    assert.equal(imageFromStack([box('', tag), img()]), null);
  }
});

test('skips an image with no source', () => {
  const image = img();
  assert.equal(imageFromStack([img(''), image]), image);
});
