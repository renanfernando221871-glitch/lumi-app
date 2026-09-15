---
name: Embedded mock status cleanup
description: How to remove phone mockup status indicators from official artwork without changing its composition.
---

Remove embedded time, signal, Wi-Fi, and battery glyphs with tightly scoped pixel masks at the image's native coordinates, reconstructing pixels from the surrounding sky.

**Why:** Layout overlays remain visible after responsive cropping, broad interpolation can pull pixels from the phone bezel, and generative image editing may change dimensions or redraw protected text and artwork.

**How to apply:** Inspect each source at native size, mask only the glyph bounds, keep the bezel and notch outside the mask, and validate both the edited source crop and the real responsive Preview.