# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static portfolio site (no build step, no package manager, no tests, no linter) for Nithin Rajkumar. Plain HTML/CSS/vanilla JS. The content comes from `NithinResume.pdf`.

## Run

```
python3 -m http.server 3000
```

Open http://localhost:3000. Serve over HTTP rather than `file://` so the frame images and fonts load.

## Architecture

- `index.html` – fixed full-screen `<canvas id="stage">` with content sections layered over it (hero, about, selected projects, experience, education, tech-stack marquee, contact). Section backgrounds are intentionally transparent so the canvas animation shows through.
- `projects.html` – separate Projects page with a static dark backdrop; it does **not** load `script.js` or the canvas.
- `style.css` – shared by both pages (nav, layout, typography, Projects page styles).
- `reveal.js` – IntersectionObserver that adds `.in` to `.reveal` elements for fade-in on scroll; loaded by both pages.
- `script.js` – scroll-driven frame player for `index.html`:
  - Preloads the 240 JPGs in `ezgif-5bb4a3ff9f632b92-jpg/` and decodes each into an `ImageBitmap` up front so drawing never waits on a JPEG decode (frames not yet decoded fall back to the nearest ready one). `FRAME_COUNT` must match the file count.
  - Maps scroll progress over the **whole page height** to a frame index, so adding or removing content changes how fast the animation plays. The `@media (max-width: 800px)` block in `style.css` removes the `min-height` sizing on most sections and tightens spacing, so mobile pages are shorter and the animation plays faster per swipe.
  - Eases toward the target frame in a `requestAnimationFrame` loop (`EASE` is the fraction covered per 60 Hz frame, scaled by elapsed time so the feel is the same at any refresh rate).
  - Crops each source frame to rows `CROP_TOP`–`CROP_BOTTOM`, which removes the watermark at the bottom of each (720×1280 portrait) frame. It anchors `cover` fitting at `FOCUS_Y` to keep the subject in view on landscape screens.

## Content updates

Edit text directly in `index.html` and `projects.html`. To update the resume, replace `NithinResume.pdf` under the same name, since the "Download resume" button links to it.
