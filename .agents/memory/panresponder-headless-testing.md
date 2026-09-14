---
name: PanResponder headless testing
description: A React Native Web testing limitation observed with Chromium DevTools Protocol drag events.
---

Chromium CDP mouse and touch sequences can update a React Native Web PanResponder's animated movement without reliably invoking its end or release callback.

**Why:** Repeated mouse and touch sequences moved drag items but did not run either release handler, making valid drops appear broken only in headless automation.

**How to apply:** Keep drop geometry in pure testable functions, validate responsive frames directly, and provide an accessible tap-object/tap-target path that exercises the same completion logic. Do not infer that real touch release is broken solely from this CDP behavior.