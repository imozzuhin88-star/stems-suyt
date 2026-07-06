---
name: stems-suyt
description: Project-specific workflow for the local stems-suyt WebStorm/Vite frontend project. Use when Codex is asked to inspect, explain, repair, redesign, refactor, or extend the Steam 2.0/Flatbub static web app in C:\Users\Ivan\WebstormProjects\stems-suyt, including tasks involving index.html, index2..html, style.css, style2.css, script.js, assets, Vite commands, mojibake/encoding cleanup, layout fixes, game-card UI work, or future project-specific debugging.
---

# Stems SUYT

## Core Workflow

1. Start by reading `memory.md` in the project root and `references/project-guide.md`; they contain the current project map, active files, known traps, and verification commands.
2. Inspect the live files before editing because this project is small and may change quickly.
3. Treat root-level `index.html`, `index2..html`, `shop.html`, `cart.html`, `library.html`, `analytics.html`, `social.html`, `community.html`, `community-created.html`, `style.css`, `style2.css`, and `script.js` as the active app unless the user explicitly asks about the WebStorm starter files in `src/` or `public/`.
4. Preserve the project's playful Steam 2.0 / Flatbub concept unless the user asks for a different direction.
5. Be especially careful with text encoding: much of the Russian text currently appears as mojibake. Do not "repair" wording by guessing large passages unless the user asks for copy cleanup or provides the intended text.
6. Keep project-specific skill and support files inside this repository, preferably under `.codex/skills/`, unless the user explicitly asks for global Codex files.
7. Keep `memory.md` updated after meaningful page, navigation, tooling, workflow, or project-rule changes.

## Editing Guidance

- Keep changes simple: this is a static HTML/CSS/JS project, not a componentized framework app yet.
- Prefer consolidating duplicated CSS only when the requested change benefits from it; avoid broad rewrites during small fixes.
- Use Prettier settings from `.prettierrc`: single quotes, print width 80, tab width 2.
- When adding new game cards or UI sections, keep existing class names and visual language unless refactoring the screen intentionally.
- If fixing JavaScript, keep the current pattern of checking that page-specific DOM elements exist before attaching handlers; `script.js` is shared by analytics, store/cart, and community pages.

## Verification

- For static-only checks, open or serve the root HTML files and verify both pages.
- For Vite flow, use `npm run dev`, `npm run build`, and `npm run preview` when dependencies are installed.
- If changing layout, inspect both desktop and narrow mobile widths.
- If changing encoding or copy, verify rendered Cyrillic text in the browser rather than only the source file.
