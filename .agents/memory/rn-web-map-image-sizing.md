---
name: RN Web map image sizing
description: How to preserve a complete illustrated map when ImageBackground crops it on React Native Web.
---

For illustrated maps whose destinations must remain aligned with interactive overlays, use an absolute `Image` inside a positioned map container when `ImageBackground` does not honor the required full-image sizing.

**Why:** An `ImageBackground` continued using a cropped cover-like result on Expo web despite a stretch resize mode, hiding one destination and moving interactive labels over the wrong illustrations.

**How to apply:** Render the base as an absolute, full-container `Image` with explicit width and height, then place destination controls as siblings in the same positioned container. Validate alignment from a cache-disabled browser session.