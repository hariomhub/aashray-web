# Implementation Plan: Website Script Integration
**Source document:** Website_Script_New.docx
**Prepared for:** Aashray Infotech website (Tango/DPDP compliance platform)
**Principle governing this plan: wording from the script is copied verbatim into the site. No paraphrasing, trimming, or "cleaning up" of the client's copy at any stage.**

---

## 1. What the document contains

The script covers **two pages**:

| Page | Sections |
|---|---|
| **Home** | Hero → "Your Data. Your Infrastructure. Your Control." → Our Approach (3-step journey + image) → Our Platforms (5 products/services) → How It Works (3-phase timeline) → Constant Innovation → Trusted By The Best |
| **About Us** | Mission statement → Company description → Leadership Team (placeholder, no content yet) |

The doc also contains one embedded graphic: an "ascending journey map" illustrating Learn → Assess → Operationalize (extracted below).

---

## 2. Content gaps already flagged in the script

These are **not implementation blockers**, but they need client sign-off before those sections go live, since there's nothing to copy in verbatim yet. Building placeholder slots for each now avoids re-touching the layout later.

| Item | Status | Where |
|---|---|---|
| Product 4 name (currently "TPRM") | 🔲 name pending | Our Platforms |
| Product 5 (Cyber Insurance) | 🔲 needs full write-up, not just heading | Our Platforms |
| Service 1 (DPO as a Service) | 🔲 name pending | Our Platforms |
| Client logos | Placeholder text only ("client names go here") | Trusted By The Best |
| Leadership Team bios | Section heading only, no content | About Us |
| Journey-map graphic | Present, but a text alt/caption is also specified ("Ascending journey map: Learn, then Assess, then Operationalize") | Our Approach |
| How It Works | Note in doc says "— as a timeline" — confirms this should render as a visual timeline component, not a plain list | How It Works |
| DPDPQuest ordering note | Doc says "(should be mentioned first)" — flag for whoever finalizes platform order; script currently lists it third | Our Platforms |

**Action:** Build the page with these sections structurally complete and styled, using the exact placeholder text from the doc (e.g., "client names go here" should NOT be replaced with invented names — leave it as a visibly marked TODO in code comments, not as live copy).

---

## 3. Implementation approach (framework-agnostic, since the site was AI-agent-generated)

Since you're not certain of the exact stack, here's how to find out and proceed safely regardless of what it turns out to be:

### Step 1 — Identify the actual stack (5 minutes)
Look for these signal files in your project root:
- `package.json` + `next.config.js` → **Next.js/React**
- `package.json` + `vite.config.js` → **React/Vue + Vite**
- `wp-content/` folder → **WordPress**
- A folder of `.html` files with shared `<head>` → **static HTML/CSS/JS**
- No visible code, only a Webflow/Framer dashboard → **no-code builder**

This determines whether you're editing components, page templates, or a visual canvas.

### Step 2 — Separate content from layout
Regardless of stack, create a single **content source file** that holds every string from the script, exactly as written (including em dashes, bold markers, and the deliberate lowercase/informal bits like "in built chatbot for questions that may arise when using the tool"). Examples:

- React/Next.js: `content/home.ts` and `content/about.ts` exporting typed objects
- WordPress: Custom Fields (ACF) or block content pasted directly into the editor
- Static HTML: the text lives directly in the HTML, but keep a parallel `content.json` as the source of truth for QA diffing
- No-code (Webflow/Framer): paste directly into text elements; keep the .docx as the reference doc for reviewers

This gives you one place to diff against the source document later, and prevents an AI coding agent from "helpfully" rewording sentences when it touches nearby code.

### Step 3 — Map sections to components
Build (or reuse existing) components for:
1. `Hero` — headline, subhead, dual CTA buttons ("Book a Demo" / "See Our Offerings"), data-control statement with the "0 bytes leave your network" callout
2. `OurApproach` — 3-step numbered list + journey-map image
3. `PlatformCard` (repeated 5×) — name, tagline (italic in source), bullet feature list, "coming soon" badge support for the 🔲 gap-spotting item
4. `HowItWorks` — 3-phase **timeline** component (explicitly requested as a timeline, not a plain list)
5. `ConstantInnovation` — paragraph block + attribution line
6. `TrustedBy` — logo strip (placeholder-ready)
7. `AboutHero` — mission statement + company description
8. `LeadershipTeam` — grid/card layout, empty state until bios arrive

### Step 4 — Preserve exact formatting cues from the doc
The script uses bold and italics meaningfully — carry these into markup, don't drop them:
- **Bold** phrases are consistently the "hook" of each bullet (e.g., **"A control library that's actually yours"**) — implement as `<strong>` or a bold span, not full-line bold.
- *Italic* lines are always the section's one-line tagline (e.g., *"Know where you stand, and what to tackle first."*) — style as a subtitle/eyebrow, not body copy.
- Bracketed CTA labels (`[Primary CTA: Book a Demo]`) indicate button text, not visible bracket text.

### Step 5 — Image asset
The journey-map image (Learn → Assess → Operationalize) has been extracted from the doc and is included with this plan. Use the doc's own alt text verbatim: *"Ascending journey map: Learn, then Assess, then Operationalize, each step higher than the last."*

### Step 6 — QA pass against the source document
Before merging/publishing:
1. Open the script doc side-by-side with the live page.
2. Read every sentence aloud against the rendered page — catches silent AI-agent rewrites that a visual diff misses.
3. Confirm bold/italic emphasis landed on the same words.
4. Confirm nothing marked 🔲 or "will add" was invented rather than left as a placeholder.
5. Check CTA button labels match bracket text exactly.

---

## 4. Suggested rollout order

1. About Us page (smallest, lowest risk — good place to validate the content-preservation workflow)
2. Home page hero + data-control section
3. Our Approach + journey image
4. Our Platforms (5 cards) — build with placeholders for the 3 unnamed items
5. How It Works timeline
6. Constant Innovation + Trusted By (logo strip left empty/pending)

---

## 5. Open questions to send back to the client before final sign-off

- Final names for Product 4 (TPRM), Product 5 (Cyber Insurance service), and Service 1 (DPO as a Service)
- Full copy for the Cyber Insurance section (currently only a heading + one paragraph)
- Client logos for "Trusted By The Best"
- Leadership Team bios/photos
- Confirm whether DPDPQuest should be reordered to appear first among the platforms, per the doc's own note

---

*Journey map image extracted from source document — see attached file.*
