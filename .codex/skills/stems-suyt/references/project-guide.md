# Project Guide

## Snapshot

- Workspace: `C:\Users\Ivan\WebstormProjects\stems-suyt`
- Package: private Vite project named `untitledgeg`
- Commands: `npm run dev`, `npm run build`, `npm run preview`
- Formatting: `.prettierrc` sets single quotes, print width 80, tab width 2.
- Persistent project memory: `memory.md` in the project root. Read and update it during future work.

## Active Surface

The active hand-built site is the root-level static app:

- `index.html`: Steam-inspired main Steam 2.0 landing page with the shared header background palette menu. Links `style.css` and `script.js`.
- `index2..html`: redesigned static about/information page. Links `style.css`.
- `shop.html`: fixed Steam-like store page with interactive filters, 23 full-width game rows, real Steam games, Steam CDN capsule covers, prices, add-to-cart controls, and Flatbub integration. Links `style.css` and `script.js`.
- `cart.html`: Steam-like cart page that reads saved store selections from localStorage, shows selected games, total price, bonus-card progress, removal controls, and checkout state. Links `style.css` and `script.js`.
- `library.html`: Steam-like interactive library page with a left game list, selected game hero, play/favorite controls, activity feed, search, and saved per-game notes. Links `style.css` and `script.js`.
- `profile.html`: merged Gaben profile page backed by Gaben Mode state. It combines buyer stats, virtual balance, dusty library stats, purchase/gift history, login streak, total spend, sale catalog, virtual cart checkout, daily bonus, Gaben gifts, marketplace listings, sale countdown, and buyer achievements without fake playtime/rank data. Links `style.css` and `script.js`.
- `gaben-mode.html`: compatibility redirect to `profile.html#gaben-mode` after the mode was merged into the profile page.
- `analytics.html`: user analytics page with Wrapped-style yearly stats, spending charts, genre breakdown, platform-average comparisons, and custom input calculation. Links `style.css` and `script.js`.
- `social.html`: Steam-like community activity hub without fake friend activity. It creates and lists only user-created communities from browser storage. Links `style.css` and `script.js`.
- `community.html`: dynamic separate community room opened by `?id=...`; each community keeps its own chat, member count, and progress checklist in localStorage. Links `style.css` and `script.js`.
- `community-created.html`: legacy compatibility page that redirects to `social.html`. Current navigation should prefer `social.html` and `community.html`.
- `style.css`: shared Steam-inspired styling for nav, animated global background, holiday/random background scenes, hover motion, hero panels, store list rows, information sections, analytics charts/forms, Gaben Mode purchase/marketplace/profile panels, and community/chat panels.
- `style2.css`: compatibility stylesheet importing `style.css`.
- `script.js`: saved background theme palette, generated background scene controls, saved background motion toggle, analytics result handling, interactive store filters, localStorage-backed cart, interactive library state, Gaben Mode virtual purchases/balance/gifts/marketplace/buyer achievements, buyer profile rendering, localStorage-backed community creation, directory rendering, activity feed, per-community chat, member count, and progress handling.

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

- `index2..html` has an unusual filename with two dots: `index2..html`. Keep links exact unless renaming is part of the request.
- `shop.html` uses external Steam CDN capsule images by app ID; offline viewing may show missing images if the browser cannot reach Steam static assets.
- `node_modules` may be absent, so `npm run build` can fail because local `vite` is unavailable.
- `script.js` is shared across several static pages; keep missing-element guards before adding page-specific handlers.
- Preserve project-local files under this repository. Do not recreate global Codex skill files unless Ivan asks.

## Useful Checks

- Run `git status --short` before editing to notice user changes.
- Search project-wide with `rg` before renaming classes or ids.
- For main page checks, verify `index.html`.
- For information page checks, verify `index2..html`.
- For store checks, verify `shop.html`.
- For cart checks, add a game from `shop.html`, confirm redirect to `cart.html`, verify item rendering, total price, removal, clear-cart, and cart count.
- For library checks, verify `library.html`, switching games, search filtering, play button state, favorite toggle, saved note, and cart count in the top navigation.
- For analytics checks, verify `analytics.html`, including the custom input form.
- For merged Gaben/profile checks, verify `profile.html`: buyer stats should render first, `#gaben-mode` should contain the sale catalog, adding sale games to the virtual cart should work, checkout should update VC balance/profile stats, daily bonus and Gaben gift opening should work, marketplace listing/purchase should work, sale countdown should tick, and achievement progress should match localStorage. The top navigation should not include a separate Gaben Mode item after the merge.
- For old-link compatibility, verify `gaben-mode.html` redirects to `profile.html#gaben-mode`.
- For community checks, verify `social.html`, creation redirect to `community.html?id=...`, per-community chat persistence, member count, progress checklist, and return to the activity feed.
- For JavaScript checks, verify only the page-specific behavior touched by the change: analytics form, store/cart, or community flow.
- For build checks, run `npm run build` if dependencies are present; otherwise inspect whether `node_modules` needs installation before asking for network/write approval.

## Visual Direction

The project is a playful dark Steam 2.0 / Flatbub game-store concept inspired by Steam:

- Dark blue/charcoal interface with blue gradients, compact top navigation, showcase panels, store list rows, charts, community panels, and update feeds.
- Global background uses animated layered dark gradients, subtle grid lines, and diagonal light bands; avoid decorative blobs/orbs.
- Active pages include a compact header dropdown for Steam, neon, forest, ember, and violet themes. The selected theme is stored in localStorage under `steam2Theme` and applies through `body[data-theme]`.
- The header dropdown also includes generated background animation scene buttons. The selected scene is stored under `steam2Scene` and applies through `body[data-scene]`.
- The header dropdown includes a saved background animation toggle. It stores `on` or `off` in localStorage under `steam2Motion` and applies `body.motion-off` when disabled.
- The header dropdown also includes image background choices stored in localStorage under `steam2BackgroundImage`; project image files are `background-desert.png`, `background-winter.png`, and `background-halloween.png`.
- `library.html` uses `body.library-static` to keep library interactions working without the added interface motion.
- Store games should feel like Steam list rows: real image cover/capsule on the left, title/tags in the middle, price/status on the right. Avoid fake names, random local images, and letter-only placeholder covers.
- Feature sections cover updates, Flatbub Core, cross-platform support, Steam Deck/Linux/PC, user analytics, and community creation/chat.
- Gaben Mode and buyer profile should stay focused on virtual shopping behavior: fake currency, virtual purchases, gifts, marketplace lots, sale pressure, and achievements from buying habits. Avoid reintroducing fake playtime, fake reviewer rank, or unrelated profile progression.
- Keep the tone energetic and game-store-like unless the user asks for a cleaner redesign.
