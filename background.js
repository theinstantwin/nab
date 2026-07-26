/**
 * Nab — service worker
 *
 * Content scripts can't download cross-origin images. An <a download> click
 * silently ignores the download attribute when the URL is cross-origin, which
 * is most of the web. chrome.downloads has no such restriction, so the actual
 * download happens here and the content script just asks for it.
 */

chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
  if (msg?.type !== 'nab-download') return;

  chrome.downloads.download({ url: msg.url, filename: msg.filename }, id => {
    respond({ ok: Boolean(id), error: chrome.runtime.lastError?.message });
  });

  return true; // keep the message channel open for the async respond
});
