# Store listing copy

Paste-ready. The store has no changelog field, so release notes sit at the
bottom of the description. Update this file whenever the live listing changes —
the dashboard isn't version-controlled.

---

## Name

```
Nab
```

## Short description (132 character limit)

```
Click and drag any image to download it instantly. Built for social media managers.
```

83 characters.

## Detailed description

```
Click and drag any image. It's in your Downloads folder.

Built for social media managers, and anyone else who saves forty images before
lunch. Right-click, wait for the menu, find "Save image as," confirm the
dialog — that's four steps and a few seconds, every single time. Do it forty
times a day and it adds up to real minutes you'd rather spend on the work
itself.

Nab makes it one motion.

HOW IT WORKS

Click and hold any image. A blue outline appears. Drag, and the outline glows
as you go, then turns green. Release and it downloads. Changed your mind? Press
Escape, or let go before the outline turns green.

BUILT FOR VOLUME

• Works on images from any source, including the CDN-hosted ones most sites use
• Filenames come out clean — photo.jpg, not photo.jpg?w=800&q=75&fit=crop
• Tells you when a download fails, and why, instead of failing quietly
• Stays out of the way: a normal click on a linked image still follows the link
• No setup, no options page, no account

WHAT IT DOESN'T DO

Background images set through CSS, inline SVG, canvas elements, and video are
outside what a drag on an image element can reach. Bulk downloading isn't the
idea either — Nab grabs the one image you dragged.

PRIVACY

Nab collects nothing. No analytics, no telemetry, no server, no storage
permission. It watches for a drag on an image and hands that image's URL to
Chrome's download manager. Nothing else leaves your browser.

Open source, MIT licensed: https://github.com/theinstantwin/nab

WHAT'S NEW IN 2.1.0

• Cross-origin images now download properly instead of opening in a tab
• Notifications report the real result rather than assuming success
• Clicks on linked images work again — Nab no longer intercepts them
• Filenames strip query strings; SVG and JPEG extensions come out right
• Downloads fire immediately, with a 300ms delay removed
```

## Category

Tools

## Language

English

---

## Asset checklist

| Asset | Spec | Status |
|-|-|-|
| Store icon | 128×128 PNG | `icons/icon128.png` |
| Screenshot 1 | 1280×800 | `store-assets/01-drag-to-download.png` |
| Screenshot 2–5 | 1280×800 | optional |
| Small promo tile | 440×280 | `store-assets/promo-small.png` |
| Marquee promo tile | 1400×560 | optional |

### These are HTML mockups, not captures

Each PNG renders from the `.html` beside it. Nothing came from a real staged
browser: the display here caps the viewport near 1272×771, so a real capture
can't reach 1280×800 without compositing, and the seams show. HTML also means a
UI change is reflected by editing markup rather than re-staging a window.

The outline is the literal `.nab-outline--ready` from `content.js` — 2px solid
`rgb(76,175,80)` with the 15px `rgba(76,175,80,.3)` glow — and the notification
is `.nab-notification` verbatim. Colours are read out of the shipped stylesheet
rather than eyeballed.

Layout follows the house pattern from `feedly-highlighter/store-screenshots/`:
inset browser frame on a soft diagonal gradient with a drop shadow, caption
centered below the frame as a bold headline plus a lighter supporting line.

### Re-rendering

```sh
cd store-assets
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1280,800 \
  --screenshot="01-drag-to-download.png" "file://$PWD/01-drag-to-download.html"
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=440,280 \
  --screenshot="promo-small.png" "file://$PWD/promo-small.html"
```

`--force-device-scale-factor=1` matters: without it a retina display renders at
2× and the store rejects the file.

The promo tile was checked at 50% as well, since store surfaces often render it
small — "Nab" and the lede both still read.

### Remaining assets

Everything required is done. Optional: up to four more screenshots, and the
1400×560 marquee tile.
