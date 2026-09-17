---
name: generateImage square canvas workaround
description: How to get a tall/narrow phone-mockup screenshot out of a generator that only returns square images.
---

`generateImage` (and the underlying model behind it) ignores aspect-ratio wording in the prompt and always returns a square canvas (e.g. 1024x1024), even when asked explicitly for a "9:19 tall portrait phone mockup." Wording alone never changed the output dimensions in practice.

**Why:** the runtime documents "does not accept an aspectRatio argument"; empirically this also means prompt-only aspect requests are not honored, so any layout that fills the square edge-to-edge comes back roughly square/boxy, not phone-shaped — cropping that square to a real phone aspect (~0.46) later would cut deep into on-screen content (~25%+ off each side).

**How to apply:** to get a narrow phone screenshot baked into a square generation, explicitly instruct the model to confine ALL content (phone + UI) to a narrow central band of the square canvas (e.g. "central 45% of the width," with the remaining left/right thirds as plain flat empty background safe to crop). Then crop away the flat side margins with ImageMagick (`-fuzz N% -trim +repage`) to get a naturally tall/narrow result (worked: 1024x1024 -> ~460x1024, aspect ~0.45, very close to real phone aspect). Verify pixel positions of tap targets by sampling color columns (ImageMagick `txt:` export) rather than eyeballing, then encode hotspot percentages relative to the final trimmed image.
