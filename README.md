# Scroll Animation

A full-screen canvas that plays the 240 frames in `ezgif-5bb4a3ff9f632b92-jpg/` as you scroll. The site content is Nithin Rajkumar's resume (`NithinResume.pdf`) laid out in the style of the reference design.

- `index.html` – a fixed full-screen `<canvas>` plus content sections layered over it: hero (with a "Download resume" button), about, selected projects, experience (three alternating left/right blocks), education, tech-stack marquee, and "Let's connect". Backgrounds and decorative images are intentionally left out so the animation shows through
- `projects.html` – the Projects page, opened from the nav bar or the "All projects" button: title and subtext, all projects, skills, a contact section and a footer. It uses a static dark grey-white shaded backdrop (no frame animation, no `script.js`)
- `NithinResume.pdf` – the resume offered by the "Download resume" button
- `reveal.js` – adds the `.reveal` fade-in on scroll; loaded by both pages
- `style.css` – shared by both pages; includes the nav bar and the Projects page styles, plus layout and typography (Anton + Barlow Condensed from Google Fonts). The animation length follows the total page height, so adding or removing content changes how fast the frames play (on screens up to 800px wide, sections drop their full-height sizing and use tighter spacing, so the page is shorter and the frames play faster per swipe). `.reveal` elements fade in on scroll; the marquee loops in CSS
- `script.js` – preloads frames and decodes each into an `ImageBitmap` up front (so scrolling never waits on a JPEG decode), maps scroll progress across the whole page to a frame index, eases toward it with `requestAnimationFrame` (`EASE` controls smoothness, scaled by elapsed time so it feels the same at any refresh rate), draws with `cover` fitting. Each frame is cropped to rows `CROP_TOP`–`CROP_BOTTOM` (removes the watermark at the bottom of each frame) and anchored vertically at `FOCUS_Y` so the subject stays in view on landscape screens

To update the content, edit the text in `index.html` and `projects.html`; replace `NithinResume.pdf` with a newer copy of the resume under the same name.

## Run

```
python3 -m http.server 3000
```

Open http://localhost:3000
