---
name: Expo Audio web completion
description: Reliable local-audio completion and transition handling with Expo Audio v57 on web.
---

Expo Audio v57 on web may not emit `playbackStatusUpdate` when an HTML audio
element naturally ends. Detect completion by periodically reading the player's
current status and checking `didJustFinish`; also check the status error.

**Why:** Event-only completion left local-audio promises pending and the UI in a
playing state after a file ended normally in the web target.

**How to apply:** For cross-platform local playback, keep completion state
scoped to one playback generation, cancel it before pause/seek, and serialize
stop/start transitions so stale seeks cannot affect a newer playback.