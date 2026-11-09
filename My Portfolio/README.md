# Niel — Personal Portfolio

A responsive personal portfolio built with plain HTML5, CSS3 and JavaScript. No
build step, framework or third-party runtime dependency is required.

**Theme:** Dark Forest Professional — near-black backgrounds, forest-green
accents, charcoal cards and editorial typography.

---

## Run the website

### Option 1 — open it directly

Double-click `index.html`. All core content, navigation, animations and the
project cards work from the local file system.

### Option 2 — use a local server (recommended)

From this folder:

```powershell
python -m http.server 8000
```

Then visit <http://localhost:8000>.

A local server is the best way to test PDF downloads because browsers treat
local files differently from files served over HTTP.

### If Live Server shows a different project

Live Server and Live Preview reuse the same `localhost` origins (usually port
`5500` or `3000`) across every folder you preview. If another app appears:

1. **Check the folder VS Code opened.** Open `C:\Users\Niel\Documents\My Portfolio`
   itself with **File → Open Folder**, not the parent `Documents` folder, then
   click **Go Live** again.
2. **Check for a stale service worker.** The Habit-Tracker project registers a
   `/sw.js` worker and a `chromatic` cache on the shared localhost origin, which
   can replay its old page. `js/main.js` now unregisters that known worker and
   clears its cache automatically. If an old page is still stuck, open
   **DevTools (F12) → Application → Service Workers → Unregister**, then
   hard-reload with **Ctrl + Shift + R**. You can also use
   **Application → Storage → Clear site data**.
3. **Stop other dev servers.** A running Next.js app also uses port `3000`.
   Stop it before previewing this site if the port is busy.

---

## Quick personalisation checklist

| What | Where |
| --- | --- |
| Display name | `js/config.js` → `profile.name` (also update `<title>` / meta description in `index.html` if you change it) |
| Photograph | `assets/images/niel-swartz.jpeg` (already configured in `profile.photo`) |
| CV | `assets/documents/cv.pdf` (already installed and enabled) |
| SAMTRAC certificate | `assets/documents/samtrac-certificate.pdf` (already installed and enabled) |
| LinkedIn / GitHub / WhatsApp / email | `social` in `js/config.js` |
| Projects | `js/projects.js` |
| Page copy | `index.html` |
| Colours, spacing, type | `css/style.css` (design tokens are at the top) |
| Live URL / SEO | `index.html`, `sitemap.xml`, `robots.txt` (see section 6) |

The current default display name is **Niel**. The hero portrait, CV button,
document cards and social links all read from `js/config.js`, so the site stays
consistent after you change one value.

---

## 1. Your photograph

The supplied photograph is already in place:

```text
assets/images/niel-swartz.jpeg
```

`js/config.js` points to it:

```js
photo: "assets/images/niel-swartz.jpeg",
photoAlt: "Niel Swartz",
```

To replace it later, save the new image in `assets/images/` and update both
values. A portrait at roughly **800 × 1000 px** (4:5) or **1080 × 1620 px**
(2:3) works well; the frame uses `object-fit: cover`, so very wide images will
be cropped. If the file path is wrong, the page falls back to the clearly
labelled placeholder instead of showing a broken image.

---

## 2. CV and SAMTRAC certificate

Both real documents are installed and enabled:

```text
assets/documents/
  cv.pdf
  samtrac-certificate.pdf
```

`js/config.js` already points to them:

```js
documents: {
  cv: {
    path: "assets/documents/cv.pdf",
    fileName: "Niel-CV.pdf",
    available: true,
  },
  samtrac: {
    path: "assets/documents/samtrac-certificate.pdf",
    fileName: "Niel-SAMTRAC-Certificate.pdf",
    available: true,
  },
},
```

- `path` is the file the browser downloads.
- `fileName` is the friendly name shown in the download.
- To hide a document again, set its `available` value to `false`; the website
  then shows the honest **"Not added yet"** state and disables the button.
- The hero **Download my CV** button updates automatically from
  `documents.cv`.

No placeholder PDFs or fake certificates are included. Both files are the
originals supplied by Niel.

---

## 3. Links, WhatsApp and email

Edit the `social` block in `js/config.js`:

```js
social: {
  linkedin: "https://www.linkedin.com/in/niel-swartz-41314633a/",
  github: "https://github.com/NielMSwartz",
  whatsapp: "https://wa.me/27662017920", // +27 66 201 7920
  whatsappDisplay: "+27 66 201 7920",
  email: "nielswartz11@gmail.com",
},
```

- The contact panel uses clickable **icon tiles** rather than showing full URLs.
  Each tile has an accessible label and a hover title.
- LinkedIn, GitHub and WhatsApp open in a new tab with
  `rel="noopener noreferrer"`.
- WhatsApp uses the international number without spaces or a leading `+`
  (`27662017920`) in the `wa.me` link.
- Email uses a `mailto:` link.
- Any empty value hides its icon and shows a short note naming what is still
  missing. Nothing is invented.
- Footer and hero social links are populated from the same values.

---

## 4. Manage projects

All project cards come from `js/projects.js`. Add, remove or reorder objects in
the array — each object becomes one card.

```js
{
  title: "Python Habit Tracker",
  description: "What the project does and what you learned.",
  tech: ["Python"],
  image: "assets/images/projects/habit-tracker.png", // or "" for a placeholder
  imageAlt: "Screenshot of the habit tracker interface",
  repo: "https://github.com/you/habit-tracker",      // or "" until it exists
  demo: "",                                          // optional live demo
  icon: "repeat",                                    // repeat | dumbbell | search | code | clipboard | monitor
  tone: "forest",                                    // forest | sage | deep
  sample: false,                                     // false hides the "Sample entry" label
}
```

- Leave `repo` or `demo` empty until the URL is real. The card will show an
  honest "Repository not added" state instead of a broken link.
- If `image` is empty, a designed placeholder is used.
- Once a project is real, fill in the details and set `sample: false`.
- Add project screenshots under `assets/images/` and keep them reasonably
  compressed.

The **Chromatic — Habits in Colour** card is a real project with a screenshot,
repository and live demo. The other two entries are still marked **Sample
entry** and do not claim that a repository or demo exists.

---

## 5. Update content and design

- **Text:** edit `index.html`. Sections are clearly commented.
- **Colours, spacing, shadows, typography:** edit the CSS custom properties at
  the top of `css/style.css` under `:root`.
- **Navigation:** update both the header and footer link lists in `index.html`
  if you rename or add a section.
- **Experience timeline:** edit the `<ol class="timeline">` block in
  `index.html`. Keep entries in reverse-chronological order.
- **Icons:** inline SVG symbols are at the bottom of `index.html`.
- **Favicon:** `assets/icons/favicon.svg`.

---

## 6. Deploy to Render

This is a plain static site — no build step and no server process. `render.yaml`
describes everything Render needs.

### Push this folder to GitHub, GitLab or Bitbucket

Render deploys from a Git provider, so the repository root must be this folder
(the one with `index.html`). If you create a new repository:

```bash
git init -b main
git add .
git commit -m "Portfolio ready for Render"
git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
git push -u origin main
```

> Only this folder should be the repository root. Do not publish the parent
> `Documents` folder.

### Option A — Blueprint (recommended)

1. Open [Render Dashboard → New → Blueprint](https://dashboard.render.com/blueprints).
2. Connect the repository.
3. Keep the detected branch (`main`) and click **Apply**.
4. Render creates a static site named `niel-swartz-portfolio`, with:
   - **Build Command:** none required
   - **Publish Directory:** `./`
   - security headers for framing, MIME sniffing and referrer data

The expected URL is `https://niel-swartz-portfolio.onrender.com`. If that name is
already taken, Render will ask for another name — use whatever URL it gives you.

### Option B — create the static site manually

In the Render Dashboard choose **New → Static Site**, connect the repo, then set:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Build Command | *(leave empty)* |
| Publish Directory | `.` |
| Auto-Deploy | On commit |

### Point the SEO files at the live URL

After the first deploy, copy the site URL and run this once from the repo root:

```bash
node scripts/set-site-url.mjs https://your-service.onrender.com
```

It updates `index.html`, `sitemap.xml` and `robots.txt`, replacing the
`https://example.com` placeholder in the canonical link, `og:url`, `og:image`,
`twitter:image`, Person schema and sitemap. Commit and push the change; Render
redeploys automatically.

```bash
git add index.html sitemap.xml robots.txt
git commit -m "Set live site URL"
git push
```

Re-run the same command whenever you add a custom domain.

### After the site is live

- Submit `https://your-domain/sitemap.xml` in
  [Google Search Console](https://search.google.com/search-console).
- Check the result in the
  [Rich Results Test](https://search.google.com/test/rich-results).
- If you change your name, role, employer or social links, update the JSON-LD
  block at the top of `index.html` to match.

### Already in place

- Canonical URL and Open Graph / Twitter large-image previews.
- A real 1200 × 630 share image at `assets/images/og-image.png`.
- `sitemap.xml`, `robots.txt` and Schema.org `Person` structured data.

---

## Project structure

```text
index.html
sitemap.xml
robots.txt
render.yaml       ← Render static-site blueprint
scripts/
  set-site-url.mjs ← points the SEO files at the live URL
css/
  style.css
js/
  config.js       ← name, photo, social links, document availability
  projects.js     ← project cards
  main.js         ← navigation, reveals, config hydration
assets/
  images/
    niel-swartz.jpeg
    chromatic-habits.jpg
    og-image.png
  icons/
    favicon.svg
  documents/
    cv.pdf
    samtrac-certificate.pdf
    README.md
README.md
```

No empty placeholder files are included.

---

## Features

- Sticky desktop navigation and a keyboard-accessible mobile menu.
- Smooth in-page scrolling with active-section tracking.
- Intersection Observer fade/slide reveals with staggered cards.
- Reduced-motion support and fully visible content when JavaScript is disabled.
- Honest states for any document or contact link that is still missing.
- Clickable contact icon tiles with accessible labels and hover titles.
- Config-driven project cards and external-link safety attributes.
- Responsive layouts tested from 320 px through 1920 px.
- No external fonts, icon libraries, animation libraries or trackers.
- Semantic HTML, a skip link, visible focus states and descriptive alt text.
- Canonical URL, Open Graph / Twitter previews, Person schema, `sitemap.xml` and
  `robots.txt`.
- `render.yaml` for a free Render static site, with sensible security headers.
- `scripts/set-site-url.mjs` to point every SEO file at the live domain.

---

## Checks performed

- HTML/CSS/JavaScript load with **no console errors** and no failed requests.
- All internal anchor targets resolve.
- Navigation, mobile menu, Escape-to-close, focus return and scrollspy tested.
- Project rendering tested with JavaScript enabled and disabled.
- Both real PDFs return HTTP 200 with a valid `%PDF` header, and both downloads
  use the intended friendly filenames.
- Social link hydration, WhatsApp, `mailto:`, new-tab attributes and missing
  link states tested.
- Stale service-worker cleanup verified by registering and then removing a test
  worker on the preview origin.
- SEO files checked: JSON-LD parses, `sitemap.xml` is valid XML, and
  `robots.txt`, `sitemap.xml` and the 1200 × 630 share image all return HTTP 200.
- `render.yaml` parses correctly and describes a `web` / `static` service with
  `staticPublishPath: ./`.
- `scripts/set-site-url.mjs` tested against a copy of the site: it updates all
  three files and leaves no `example.com` placeholders.
- Keyboard tab order and skip link tested.
- Reduced-motion and no-JavaScript fallbacks tested.
- Automated WCAG 2.1 A/AA checks (axe-core) reported **zero violations** on the
  default and fully configured states.
- No horizontal overflow at 320, 360, 390, 480, 768, 1024, 1280, 1440 or
  1920 px.
