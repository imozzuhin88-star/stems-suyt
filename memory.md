# Project Memory

## Purpose

This project is a small static WebStorm/Vite frontend for a playful Steam 2.0 / Flatbub game-store concept.

## Current Pages

- `index.html`: Steam-inspired main landing page with a top bar, featured showcase, recommendation cards, update feed, links to analytics/social features, and the shared header background palette menu.
- `index2..html`: redesigned static information page about the platform, Flatbub Core, compatibility, analytics, social features, and development plan.
- `shop.html`: Steam-like store catalog shown as full-width game rows with real Steam game names, Steam CDN capsule covers, filters, prices, and Flatbub Core status.
- `cart.html`: Steam-like cart page that renders games saved from the store, shows total price, bonus card progress, removal controls, and checkout state.
- `library.html`: Steam-like interactive library with a left game list, selected game hero, play/favorite controls, activity feed, and per-game saved notes.
- `profile.html`: merged Gaben profile page with buyer stats plus the full virtual purchase mode: sale catalog, virtual balance, cart checkout, daily bonus, Gaben gifts, marketplace listings, purchase/gift history, login streak, and buyer achievements without fake playtime/rank data.
- `gaben-mode.html`: compatibility redirect to `profile.html#gaben-mode` after Gaben Mode was merged into the profile page.
- `analytics.html`: user analytics page with a yearly Wrapped-style report, charts, comparison with platform averages, and a custom input form that calculates a result.
- `social.html`: Steam-like community activity hub. It lists only user-created communities from browser storage, supports search, and creates new communities.
- `community.html`: dynamic separate community room opened by `?id=...`; each saved community has its own chat, member count, and progress checklist.
- `community-created.html`: legacy compatibility page that immediately redirects to the new community activity hub.

## Active Files

- `style.css`: shared Steam-inspired styling for all active pages, including analytics panels, charts, existing-community/chat pages, store list rows, hover animations, holiday background animation scenes, and the animated global background.
- `style2.css`: compatibility stylesheet that imports `style.css`.
- `script.js`: analytics result handler, saved background theme palette, saved background animation scene, motion toggle, store filtering, localStorage-backed cart, Gaben Mode virtual purchases/balance/gifts/marketplace/buyer achievements, buyer profile rendering, and localStorage-backed community creation, directory rendering, activity feed, per-community chat, member count, and progress saving.
- `.codex/skills/stems-suyt/`: local project skill and reference notes for future Codex work.

## Project Rules

- Keep project-specific changes inside `C:\Users\Ivan\WebstormProjects\stems-suyt` unless Ivan explicitly asks otherwise.
- Keep this `memory.md` updated after meaningful structural, navigation, page, tooling, or workflow changes.
- Preserve the Steam 2.0 / Flatbub visual direction unless Ivan asks for a redesign.
- Be careful with Cyrillic text and encoding. Some old files previously displayed mojibake in terminal output.
- Before editing, check the current files and `git status --short`.

## Verification Notes

- Check links across all active pages after navigation changes.
- Run `npm run build` when dependencies are installed.
- As of the last check, `node_modules` was missing, so `vite` was not available for `npm run build`.

## Recent Changes

- Fixed the `shop.html` header so the cart link stays sticky at the right edge of the store navigation instead of protruding under the background menu.
- Added `shop.html` as the third page.
- Reworked navigation to include `Главная`, `Информация`, and `Магазин`.
- Updated `script.js` so it avoids failing when `.cards` is absent.
- Added local project skill files under `.codex/skills/stems-suyt/`.
- Redesigned `index.html` and `index2..html` around a Steam-like dark store interface, shared top navigation, large showcase panels, cards, and platform explanation sections.
- Added `analytics.html` with user-facing analytics: yearly Wrapped report, monthly/genre spending charts, comparison with platform averages, and a custom input result form.
- Reworked `social.html` into a Steam-like activity hub for real user-created communities and added `community.html` for separate saved community rooms.
- Fixed `shop.html` as a Steam-like list with real Steam game names and Steam CDN capsule covers instead of fake titles, local random images, or letter placeholders.
- Replaced old fake game references/placeholders on the main and analytics pages with real Steam game names and Steam CDN imagery.
- Added interactive store filters, animated add-to-cart buttons, saved cart state, and a new `cart.html` checkout-style page.
- Added a persistent cart link and a new library link to the shared navigation on active pages.
- Added `library.html` and library interactions: game selection, search, play state, favorites, activity entries, and saved notes.
- Expanded `shop.html` with additional games from the Steam library reference screenshot, including Morrowind, Fallout: New Vegas, Fallout 4, Fallout 76, Phasmophobia, Dead by Daylight, Borderlands 2, Sea of Thieves, Death Stranding Director's Cut, and SCP: Secret Laboratory.
- Improved the global site background with layered Steam-like grid, diagonal light bands, and darker edge depth.
- Moved the background palette controls into a compact shared header dropdown, softened the hover animations, and added a saved background animation on/off toggle.
- Added generated animation-scene controls to the header dropdown: waves, winter trees, Halloween pumpkins, Easter eggs, and arcade/random movement.
- Disabled interface animations inside the library page while keeping its interactions.
- Fixed background scene visibility by placing `body::before` and `body::after` above the base body background while keeping page content on a higher z-index.
- Replaced the old profile/gamification page with a buyer profile driven by Gaben Mode: virtual balance, dusty library, purchase/gift history, login streak, and buyer-behavior achievements.
- Added Gaben Mode mechanics: virtual sale purchases, a cart and checkout flow, 10,000 VC starting balance, daily bonus, Gaben gift opening, marketplace listings, sale countdown, and requested achievements for duplicate buys, dusty libraries, sale sprees, spending the full balance, and 7-day return visits.
- Merged Gaben Mode into `profile.html`; `gaben-mode.html` now redirects to `profile.html#gaben-mode`, and the separate Gaben Mode navigation item was removed so users enter it through the profile.
- Adjusted shared header navigation so menu items, including the cart link, stay on a single horizontal line with internal scrolling on narrow screens.
- Added image background choices inside the shared `Фон Steam 2.0` menu: desert, winter, and Halloween images copied into the project as `background-desert.png`, `background-winter.png`, and `background-halloween.png`; the choice is saved in localStorage under `steam2BackgroundImage`.
