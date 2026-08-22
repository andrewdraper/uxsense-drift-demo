# uxsense-drift-demo

A public, deliberately-regressed demo repository used to show Drift running on a real pull request.

## What this is

This repo hosts a small deployed site plus an open pull request that introduces a known UX regression. Drift runs as a check on that PR, so anyone can open the PR and read the check output for themselves.

The site is **Northwind Rail**, a five-step seat-booking flow — search → choose a service → passenger details → payment → confirmation. It is deliberately an ordinary form-driven flow: real validation, real client-side routing, no canvas. Those are the paths a returning user learns, and they are what Drift measures.

## Scope

This repository exists for one purpose: to demonstrate UXSense Drift running on public pull requests, where anyone can read the checks for themselves.

It is **not** a product, a reference implementation, or an app anyone should depend on. Northwind Rail is a fiction. There are no real trains, no real fares, no real payments — card details are validated in the browser and never sent anywhere — and no backend of any kind.

The open pull requests here are the point of the repo, not work in progress. They are deliberate, documented in their own descriptions, and will not be merged; `main` stays the clean baseline they are measured against.

## Ground rules

- **The regression PR is never merged.** It stays open as a permanent, inspectable artifact. `main` is always the clean baseline.
- The regression is deliberate and documented in the PR body.
- Nothing here is production infrastructure. No card is charged; there is no backend.
- Session recordings come from synthetic interaction with this demo site only — never from real customers.

## Running it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm test           # vitest — fare, timetable and validation logic
npm run build      # typecheck + production build
```

CI runs typecheck, test and build on every pull request
(`.github/workflows/ci.yml`). **The regression PR passes all three** — the unit
tests cover validation and timetable logic, which is what unit tests usually
cover, and a behavioural regression lives in neither. That gap is the point.

## How UXSense is wired in

Two independent pieces, both active from the first deploy:

**1. The recorder snippet** — injected into `index.html` at build time by a small Vite plugin (`vite.config.ts`) when `VITE_UXSENSE_PROJECT_ID` is set:

```html
<script src="https://app.uxsense.ai/api/r.js?id=$VITE_UXSENSE_PROJECT_ID" async defer></script>
```

The project id lives in the deploy environment, not in this repo. With it unset the site builds and runs normally and records nothing.

**2. Build-time component stamping** — `@uxsense/stamp` runs as a Babel plugin through `@vitejs/plugin-react`. It adds an opaque `data-uxs` attribute to each component root and emits `uxsense-manifest.json`, which `npm run upload-manifest` sends to UXSense after each build. **Without the manifest a Drift check runs in limited mode**, so stamping is required here, not optional.

> Note for anyone copying this setup: the Babel plugin must be referenced as `module:@uxsense/stamp`. Plain `@uxsense/stamp` makes Babel look for `@uxsense/babel-plugin-stamp` and the build fails. The package README's Vite snippet omits the prefix.

`uxsense-manifest.json` is gitignored — incremental builds only re-stamp changed files, so the manifest is complete only on the clean builds CI does anyway.

## Deploying

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/uxsense-ai/uxsense-drift-demo)

`render.yaml` is a Render Blueprint: a static site with `previews.generation: automatic`, so every pull request gets its own deployed preview URL. That per-PR preview is what Drift compares against the baseline.

Two environment variables must be set in the Render dashboard (both marked `sync: false`, so they are never committed) — see `.env.example`:

| Variable | Where it comes from | Used by |
| --- | --- | --- |
| `VITE_UXSENSE_PROJECT_ID` | app.uxsense.ai → project → Connections | the recorder snippet |
| `UXSENSE_API_KEY` | app.uxsense.ai → project settings | `uxsense upload-manifest` |

The build tolerates a missing `UXSENSE_API_KEY` (it skips the upload rather than failing), so the site deploys before the keys are in place.

## Where to start

The pull requests are the point of this repo. Both are permanently open and will never be merged.

- **[#2 — Give the results list an even vertical rhythm](https://github.com/andrewdraper/uxsense-drift-demo/pull/2)**
  Four lines of CSS that make the **Select** button unreachable below 545px. Green CI, green unit tests, and a clean component check — caught only by replaying recorded journeys against the pull request's preview. Mobile blocks, desktop passes.

- **[#4 — Lead the results with price, and rename ServicesPage](https://github.com/andrewdraper/uxsense-drift-demo/pull/4)**
  An ordinary refactor that breaks nothing, on a component sitting in the path of every completed booking. Caught from the build manifest alone, with no preview deployment involved.

Read them in that order: #2 is what nothing else catches, #4 is what you get from a single line of CI.

- **Live site** — <https://northrail.uxsense.ai>
- **Setting Drift up on your own repo** — <https://app.uxsense.ai/help/drift-setup>
