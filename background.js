/**
 * Nab — service worker
 *
 * Content scripts can't download cross-origin images. An <a download> click
 * silently ignores the download attribute when the URL is cross-origin, which
 * is most of the web. chrome.downloads has no such restriction, so the actual
 * download happens here and the content script just asks for it.
 */

function startDownload(url, filename, respond) {
  const options = filename ? { url, filename } : { url };

  chrome.downloads.download(options, () => {
    const error = chrome.runtime.lastError?.message;

    // Chrome refuses some names outright, such as ones with a leading dot. Its
    // own naming always works, so a bad name shouldn't cost the download.
    if (error && filename) {
      startDownload(url, undefined, respond);
      return;
    }

    respond({ ok: !error, error });
  });
}

chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
  if (msg?.type !== 'nab-download') return;

  startDownload(msg.url, msg.filename, respond);

  return true; // keep the message channel open for the async respond
});
