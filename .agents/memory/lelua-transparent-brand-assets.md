---
name: Leluá transparent brand assets
description: Preserving the official Leluá logo and complete greeting-pose mascot without clipping or background residue.
---

Use the official raster logo with its slogan and route all three onboarding screens through the shared character component and its complete greeting-pose asset. Do not recreate the logo as text or use the cropped mascot export whose raised hand ends at the image boundary.

**Why:** Automatic background removal left low-opacity sky pixels around the logo, while the first mascot export was already cropped at the raised hand. The project also contained a visually identical official greeting pose with the complete hand, leaves, bag, and star.

**How to apply:** Keep the complete greeting pose as the shared `main` character source for onboarding. Inspect composites on contrasting backgrounds, sample corner alpha values, and confirm visible margin around both leaves and the raised hand. Treat a rendered checkerboard as suspect until `opaque=false` and the alpha bounds exclude the canvas edges; some image edits bake the checkerboard into RGB pixels and need a separate background-removal pass. When replacing a baked-in logo, clear the previous mark with a feathered sky/background patch before compositing the official transparent logo; otherwise old text remains visible through transparent pixels.