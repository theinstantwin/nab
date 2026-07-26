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
| Screenshot 1 | 1280×800 | `store-assets/screenshot-1-drag.png` |
| Screenshot 2–5 | 1280×800 | optional |
| Small promo tile | 440×280 | `store-assets/promo-tile-440x280.png` |
| Marquee promo tile | 1400×560 | optional |

### Screenshot 1

Shows a mid-drag on a photo-essay page: the outline green at the moment the
threshold is crossed, a dashed arrow tracing the drag, the cursor at its end,
and the real "✓ Downloading: img237.jpg" notification. Caption band burned in
along the bottom: "Click and drag any image. It downloads." / "Built for social
media managers."

The drag was held open by dispatching `mousedown` and `mousemove` without a
`mouseup`, which keeps the green state on screen long enough to capture. The
notification text is what Nab actually produced during a live download, not
mocked copy.

To reshoot: the source page is a throwaway gallery, and the display here caps
the viewport near 1272×771, so the 800px height comes from compositing the
740px crop onto a 1280×800 canvas with the caption band filling the remainder.

### Promo tile

Icon and wordmark left with the "Click and drag any image / It downloads" copy
and the audience line, a bordered photo right showing the green outline and a
"✓ fjord.jpg" chip. Built on the same near-black as the screenshot caption band.

A bright photo matters here: the first pass used the black-dog crop from the
screenshot and the green outline disappeared against the dark tile. Checked at
50% too, since store surfaces often render the tile small — "Nab" and "It
downloads." both still read.

### Remaining assets

Everything required is done. Optional: up to four more screenshots, and the
1400×560 marquee tile.
