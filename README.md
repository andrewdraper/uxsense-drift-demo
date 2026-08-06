# uxsense-drift-demo

A public, deliberately-regressed demo repository used to show Drift running on a real pull request.

## What this is

This repo hosts a small deployed site plus an open pull request that introduces a known UX regression. Drift runs as a check on that PR, so anyone can open the PR and read the check output for themselves.

## Ground rules

- **The regression PR is never merged.** It stays open as a permanent, inspectable artifact. `main` is always the clean baseline.
- The regression is deliberate and documented in the PR body.
- Nothing here is production infrastructure.

## Links

Pull requests are the point of this repo — start there.
