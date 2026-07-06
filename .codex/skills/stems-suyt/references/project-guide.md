# Project Guide

## Snapshot

- Workspace: `C:\Users\Ivan\WebstormProjects\stems-suyt`
- Package: private Vite project named `untitledgeg`
- Commands: `npm run dev`, `npm run build`, `npm run preview`
- Formatting: `.prettierrc` sets single quotes, print width 80, tab width 2.

## Active Surface

The active hand-built site appears to be the root-level app:

- `index.html`: main Steam 2.0 catalog page. Links `style.css` and `script.js` at the bottom.
- `index2..html`: secondary/about-information page with `.cards`. Links `style2.css` and `script.js`.
- `style.css`: main catalog styling for nav, filters, feature strip, cards, and footer.
- `style2.css`: secondary page styling and duplicated Steam-like card/filter styles.
- `script.js`: creates image/text cards inside `.cards` using root media files.

Media assets at the root include `Header_1.jpg`, `gaben-steam.gif`, `imp2w2xo.jpg`, `jesus-loves-you-te-ama.gif`, `images.jpg`, and `images (1).jpg`.

## Starter Files

These look like the original WebStorm/Vite starter and are probably not part of the current visible site unless routing changes:

- `src/main.js`
- `public/style.css`
- `public/background.svg`
- `public/webstorm-logo.svg`
- `public/webstorm-icon-logo.svg`
- `public/technologies.svg`
- `public/javascript.svg`
- `public/fonts/*`

Do not spend time refactoring these unless the user asks about the Vite starter, counter demo, or app entrypoint.

## Known Traps

- Russian/Cyrillic text in `index.html`, `index2..html`, `script.js`, and some comments appears as mojibake. Preserve it unless the task is to fix encoding or rewrite copy.
- `index.html` contains duplicated `<main class="container">` elements and some empty structural elements. Check DOM structure before large layout edits.
- `script.js` calls `cards.appendChild(...)` without guarding for pages that do not contain `.cards`; this can break on `index.html`.
- `index2..html` has an unusual filename with two dots: `index2..html`. Keep links exact unless renaming is part of the request.
- There are two CSS files with overlapping class names. A change to `.card`, `.features-small`, `.filters`, or `.game-grid` may need to be mirrored or intentionally scoped.
- Several class names are present in HTML but lightly or not styled (`glass-nav`, `footer`, `search-bar`, `gamesContainer`, `toast`).
- External placeholder images from `https://placehold.co` are used in game cards; offline viewing may show missing images.

## Useful Checks

- Run `git status --short` before editing to notice user changes.
- Search project-wide with `rg` before renaming classes or ids.
- For main page checks, verify `index.html`.
- For JavaScript card generation checks, verify `index2..html`.
- For build checks, run `npm run build` if dependencies are present; otherwise inspect whether `node_modules` needs installation before asking for network/write approval.

## Visual Direction

The project is a playful dark Steam 2.0 / Flatbub game-store concept:

- Dark backgrounds, neon blue/green/purple accents, gradient headings.
- Game cards with cover/icon, title, tags, price, hover lift.
- Feature chips about updates, Flatbub Core, cross-platform support, Steam Deck/Linux/PC.
- Keep the tone energetic and game-store-like unless the user asks for a cleaner redesign.
