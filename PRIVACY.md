# Privacy Policy for Nab

**Last updated:** July 27, 2026

## Summary

Nab does not collect, store, transmit, or share any user data.

## What Nab does

Nab watches for a mouse drag on an image element in the page you are viewing.
When you drag an image past a short threshold and release, Nab passes that
image's URL to Chrome's own download manager, which saves the file to your
Downloads folder.

That is the extension's entire function.

## Data collection

None. Specifically, Nab does not collect or process any of the following:

- Personally identifiable information (name, address, email, age, ID numbers)
- Health information
- Financial or payment information
- Authentication information (passwords, credentials, security questions)
- Personal communications (email, texts, chat messages)
- Location data
- Web browsing history
- User activity (clicks, mouse position, scroll, keystroke logging)
- Website content (text, images, sounds, files, or form inputs from the pages
  you visit)

Nab reads one thing from the page: the URL of the specific image you chose to
drag. That URL is sent only to Nab's own service worker, which hands it to
Chrome's download API. It is not stored, logged, or transmitted anywhere else.

## No storage, no network, no analytics

- Nab requests no `storage` permission and keeps no database, file, or cookie.
- Nab makes no network requests of its own. It contacts no server, because
  there is no server.
- Nab contains no analytics, telemetry, tracking, crash reporting, or
  advertising code.
- Nab loads no remote code. Both scripts ship inside the extension package.

## Permissions and why they exist

**`downloads`** — lets Chrome save the image you dragged. A content script
cannot save an image hosted on another domain, so the download runs through
Chrome's download API instead.

**Access to all websites** (`content_scripts` matching `<all_urls>`) — the
script has to be present on a page to notice you dragging an image there. You
can drag an image on any site, the same way the browser's built-in "Save image
as" works everywhere. Chrome displays this as "read and change all your data on
all websites," which is the standard warning for any extension that runs on
arbitrary pages. Nab uses that access only to listen for mouse and drag events
on image elements.

## Third parties

Nab shares no data with third parties, because it collects none. Nab sells no
data. Nab uses no data for creditworthiness, lending, or advertising.

## Source code

Nab is open source under the MIT license. The entire extension is two
JavaScript files, and you can read them:

https://github.com/theinstantwin/nab

## Changes to this policy

Any change to this policy will be committed to the repository above, with the
date at the top updated.

## Contact

Questions or concerns: open an issue at
https://github.com/theinstantwin/nab/issues
