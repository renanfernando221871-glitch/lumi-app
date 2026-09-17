---
name: Chrome headless mobile viewport
description: Exact viewport validation for responsive screenshots and DOM measurements in headless Chromium.
---

Do not assume `chromium --window-size=W,H` creates a DOM viewport of W×H. In this workspace, a requested 390×844 screenshot file still rendered the page with `innerWidth=500` and `innerHeight=701`.

**Why:** Screenshot pixel dimensions alone can falsely appear to validate a responsive layout while the DOM is using Chromium's minimum headless window dimensions.

**How to apply:** Start Chromium with a remote debugging port, then call `Emulation.setDeviceMetricsOverride` through CDP before navigating. Confirm `innerWidth`, `innerHeight`, `documentElement.clientWidth`, and `scrollWidth` through `Runtime.evaluate`; use `Page.captureScreenshot` for the final image.