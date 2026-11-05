# MUHAMMEDALY — Portfolio V8

## Run locally
1. Extract this ZIP.
2. Open folder in Visual Studio Code.
3. Install the Live Server extension, then right-click `index.html` → Open with Live Server.
4. Test all four navigation links, the USA map, company case-study pages, and YouTube players.

## Pages
- `index.html` — loading intro (once per session), hero, About preview, services, work process, interactive Seattle/Kirkland/San Francisco map and CTA.
- `work.html` — coding, graphic design, and video production (four companies).
- `about.html` — interests, hiking, running, vlog placeholders, skills and resume placeholder.
- `contact.html` — inquiry form: can copy message, or open email draft **after** configuring a real contact email.
- `elastix-ai.html`, `sabbey-data.html`, `eastside-business-alliance.html`, `steiger-dynamics.html` — individual video production case studies.

## Before launch: important
- Set `CONTACT_EMAIL` near the bottom of `script.js` to your real email to enable the **Prepare email** button (opens mail app; does NOT send on its own). A production contact form that submits directly to an inbox requires a hosted service or backend.
- Replace the About-page resume placeholder by adding `assets/resume.pdf` and removing `aria-disabled="true"` in `about.html`.
- Add actual coding/design project images and approved vlog URLs. These remain labeled placeholders — not fabricated projects.
- All roles are **filming and lighting**, not video editing.
- Video thumbnails and embeds require internet and YouTube's embed permissions.
- Local pages should be previewed with Live Server, not by opening files using file://.
- The maps are graphic representations, not street-accurate geolocation.
- Check that you have permission to publicly feature all client footage and company names.
- Accessibility: skip link, reduced-motion preference, keyboard-friendly map buttons, labels for form fields.

## Customize
- Colors and fonts: `style.css` (`:root` near top).
- Headline/services: `index.html`.
- Map company data: `locationProjects` inside `script.js`.
- Page transitions and contact email: `script.js`.


## Version 9: SVG work-locations map

The homepage map now uses `assets/us-map.svg`, created from the vector state outlines supplied by the portfolio owner. The original source's 13 example markers were removed. Three actual work locations are marked with accessible HTML buttons: Seattle (Elastix AI, Sabbey Data Corporations), Kirkland (EastSide Business Alliance), San Francisco (Steiger Dynamics). Click a marker and then a company in the right panel to open its case study. Seattle and Kirkland are close on the map; the marker for Kirkland is visually offset for easier interaction and should not be interpreted as exact geographic plotting. To tune marker positions, edit each `--x` and `--y` on the `.map-hit` buttons in `index.html`. No behind-the-scenes footage or editing credits were added.
