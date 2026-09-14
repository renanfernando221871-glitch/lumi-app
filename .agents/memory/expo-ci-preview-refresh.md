---
name: Expo CI preview refresh
description: Why recent visual changes may not appear in the Lumi web Preview until the workflow restarts.
---

The Expo web workflow runs in CI mode, which disables automatic reloads. After visual or catalog-data changes, restart the application workflow before treating unchanged Preview output as a rendering defect.

**Why:** A corrected activity visual continued to show its previous emoji in Preview even though the renderer and current data were correct; the browser was serving the earlier bundle.

**How to apply:** Restart the configured Expo workflow once after a coherent edit batch, then inspect the freshly bundled Preview and logs.