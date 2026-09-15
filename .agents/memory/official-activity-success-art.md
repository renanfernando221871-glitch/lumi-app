---
name: Official activity success art
description: How to preserve interaction state when an official activity reference already contains its correct-answer treatment.
---

When an official activity image already includes the selected answer and success message, keep a neutral derivative for the unanswered state and switch to the untouched official image only after the engine reports completion.

**Why:** Runtime masks over embedded labels can obscure answer text or leave visible patches, while displaying the supplied image continuously makes the activity look completed before the child answers.

**How to apply:** Use this approach only for official full-screen activity art that bakes stateful feedback into the image. Keep the interaction engine, target IDs, attempts, persistence, and navigation independent from the visual swap.