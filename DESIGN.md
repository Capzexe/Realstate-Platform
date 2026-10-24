---
name: VeriSale
description: Calm, report-led Latvian property history.
colors:
  green: "#173d2e"
  green-hover: "#285b44"
  ink: "#21392e"
  muted: "#5e6e64"
  sage: "#eaf1ed"
  soft: "#f4f7f5"
  yellow: "#ffdf57"
  line: "#dce5de"
  white: "#ffffff"
typography:
  display:
    fontFamily: '"DM Sans", sans-serif'
    fontSize: "clamp(32px,3.1vw,42px)"
    fontWeight: 700
    lineHeight: 1.16
    letterSpacing: "-.03em"
  headline:
    fontFamily: '"DM Sans", sans-serif'
    fontSize: "clamp(26px,2.2vw,32px)"
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: "-.03em"
  title:
    fontFamily: '"DM Sans", sans-serif'
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-.02em"
  body:
    fontFamily: '"DM Sans", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.75
  lead:
    fontFamily: '"DM Sans", sans-serif'
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: '"DM Sans", sans-serif'
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
  wordmark:
    fontFamily: '"Instrument Serif", Georgia, serif'
    fontSize: "33px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-.035em"
rounded:
  control: "5px"
  inset: "6px"
  feature: "7px"
  preview: "8px"
  container: "10px"
spacing:
  control-gap: "6px"
  grid-gap: "14px"
  compact: "18px"
  content: "20px"
  inset: "24px"
  paper: "28px"
  section-mobile: "44px"
  section: "62px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 19px"
  button-primary-hover:
    backgroundColor: "{colors.green-hover}"
  button-yellow:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 19px"
  text-link:
    textColor: "{colors.green}"
    typography: "{typography.label}"
    padding: "9px 0"
  navigation:
    backgroundColor: "{colors.green}"
    textColor: "{colors.white}"
    height: "62px"
  feature-card:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.ink}"
    rounded: "{rounded.feature}"
    padding: "22px 20px"
  report-paper:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.container}"
    padding: "28px"
---

# Design System: VeriSale

## Overview

**Creative North Star: "The Clear Property Report"**

VeriSale uses a calm property-report language derived from the user's pinned Estimo reference: compact forest navigation, pale sage and white sections, tightly set dark headings, restrained yellow actions, illustrative photography, and readable report papers.

The interface moves between persuasion and practical data work without changing its component family. Paper overlap gives report previews a tangible presence; tables, fields, pricing and result rows remain orderly and understated. DM Sans carries the interface, while Instrument Serif is reserved for the wordmark.

The north-star phrase describes the implemented reference-led system; it is documentation language, not a separate visual concept. Visual authority remains the user's supplied Estimo reference recorded in `.impeccable/surfaces/home.md`.

**Key Characteristics:**

- Light sage and white surfaces with forest structure.
- Medium-scale sans-serif headings and a distinctive serif wordmark.
- Compact controls, softly curved containers and restrained paper depth.
- Real report patterns, explicit demo labels and credited illustrative photography.

## Colors

The palette combines quiet green neutrals with a small, warm action accent. The frontmatter records reused primitives from `public/css/app.css`; contextual near-white tints remain local surface treatments.

### Primary

- **Forest Green** (`green`): header, main buttons, active report navigation, report summaries, purchase panel and closing search.
- **Open Forest** (`green-hover`): primary-action hover treatment.

### Secondary

- **Warm Yellow** (`yellow`): selected action buttons, wordmark dot, homepage underline and focus visibility on dark surfaces.

### Neutral

- **Forest Ink** (`ink`): headings, body emphasis and chart labels.
- **Quiet Green Grey** (`muted`): prose, metadata, field help and credits.
- **Pale Sage** (`sage`): section surfaces, feature cards and report highlights.
- **Soft Paper** (`soft`): operating-page canvas and inset data surfaces.
- **Sage Line** (`line`): dividers and list separation.
- **White** (`white`): report paper, search fields and plain sections.

**The Reserved Yellow Rule.** Use yellow for selected actions, the wordmark dot and the homepage text underline. The featured pricing surface remains forest green.

## Typography

**Display and Body Font:** self-hosted DM Sans, weights 400–700, with sans-serif fallback.
**Wordmark Font:** self-hosted Instrument Serif, with Georgia and serif fallbacks.

Headings are compact, dark and tightly tracked, with balanced wrapping. The serif wordmark adds character without becoming a display-heading style. Font source and license records are in `public/ASSETS.md` and `public/fonts/`.

### Hierarchy

- **Display:** the frontmatter display role supplies the base h1. Inner-page heroes use (36px), becoming (33px) below the mobile breakpoint; the printable live report uses (30px), then (27px).
- **Headline:** the headline role supplies section h2; mobile section headings use (26px).
- **Title:** base h3 follows the title role; feature titles use (14px), benefit titles (17px), and report panel titles (19px).
- **Body:** base paragraphs follow the body role. Leads use the lead role and a maximum line length (65ch); section descriptions are (13px). Dense report and pricing copy is generally (10–12px).
- **Label:** action text follows the label role. Navigation is regular weight (12px); active state is conveyed by color and underline. Metadata may use (9–11px) in report illustrations.
- **Numbers:** report money uses grouped spaces, euro suffix and a dash for missing values. Prices and tables use tabular numerals where declared. Prominent pricing amounts use (43px); report totals and summaries use (26–32px).

## Layout

A centered shell is bounded at (1080px), with desktop width `min(1080px, calc(100% - 96px))`. Standard sections use the frontmatter section spacing; mobile uses section-mobile spacing. Section headings center within (690px), descriptions within (580px), and a left-aligned variant supports operating pages.

The homepage starts with a light split hero (1.08fr / 1fr), working search and included-data list opposite overlapping report previews. This is the homepage expression, while the shared inner hero uses text and a credited photograph (1.2fr / .85fr). Standard split stories use broad breathing room (70px gaps); feature grids use four columns or an explicit three-column variant. The report showcase places section navigation beside a flexible paper panel. Property detail uses a wider data panel beside a forest purchase panel. Search results use ruled horizontal rows.

Responsive rules are source-defined at maximum widths:

- **1100px:** shell gutters become (36px per side); large grid gaps and pricing padding tighten.
- **900px:** header search shortcut disappears; four-column features become two columns; report overview stacks internally; the report sidebar narrows.
- **700px:** shell gutters become (20px per side); the text menu opens beneath a (60px) header; hero, story, three-column feature, property and pricing layouts stack. The standard feature grid remains two columns. Report section navigation becomes a two-column grid above the panel; contact pairs stack, and inputs use (16px) text.
- **400px:** shell gutters become (16px per side); search wraps to a full-width input and button; report previews and dense data typography tighten.

The CSS supports a minimum body width (320px). Tables have horizontal scrolling containers. The footer moves from three columns to two, with its identity block spanning both mobile columns.

**The Shared Family Rule.** Extend the existing section, hero, search, report and pricing patterns before adding a new visual language.

Printing hides the header, footer, FAQ, final search, toolbar, notices and skip link. The shell becomes full width, section/report padding clears, tables become (10px), and report blocks, summaries and data grids avoid page breaks. The forest report summary preserves its print color; chart height is limited (220px). PDF saving is browser printing.

## Elevation & Depth

Most depth comes from sage/white tonal layering and thin quiet borders. Report paper receives diffuse elevation; the hero adds modest rotated overlap. Search receives a smaller ambient shadow. Feature and pricing cards stay flat.

### Shadow Vocabulary

- **Report paper:** `0 16px 45px -25px #1b3b3038`, shared by preview papers and the layered history example.
- **Search:** `0 8px 24px -17px #173d2e60`, used on the working search container.

**The Paper Depth Rule.** Reserve diffuse elevation and overlap for report papers; ordinary sections and data containers rely on tone and borders.

The main hero report visibly settles once from a small vertical offset and a slight rotation into its resting angle (850ms, cubic-bezier(.16,1,.3,1)). It remains visible throughout. Interactive color/shadow transitions use (180ms ease). Reduced-motion preference disables animation and transitions and restores automatic scrolling.

## Shapes

Controls have gently curved corners using the control radius; feature cards and search use the feature radius, report previews the preview radius, and report papers/photos the container radius. Insets commonly use the inset radius. Pricing cards use a local (9px) radius and a thin green-grey border. Quiet rules separate table rows, benefits, results and FAQ items. Numbered steps and chart points use small circles; decorative tag pills are not part of this system.

## Components

### Buttons

Compact, clear and quietly confident. Primary buttons use forest/white; selected promotional actions use yellow/ink. The base minimum height is (43px); search buttons use (39px). Hover shifts the primary to Open Forest and yellow to `#f2cd3c`. Global keyboard focus is a forest outline (2px) with an offset (4px); dark surfaces use yellow. Text links use a small arrow with generous separation and underline on hover. Submit-loading enhancement disables the button and exposes form busy state, then restores it on page return.

### Inputs / Fields

The white search field and its button share a bordered container with modest depth and a focus-within outline. It submits a real address/cadastre query, with a visually hidden accessible label. Contact fields use pale green backgrounds, fine borders, control-radius corners and padding (12px 14px); textarea resizing is vertical. Native validation and shared server feedback remain visible. Mobile input text increases to prevent cramped typing.

### Navigation

The forest header is sticky with a compact serif wordmark and light text links. Current/hover links gain a yellow underline and white text. Mobile navigation uses a labelled text toggle with `aria-expanded` and `aria-controls`. Report type and section navigation are real links with `aria-current`; selected items become forest/white. No tag or chip primitive is established.

### Cards / Containers

Feature cards use sage fill, no shadow and compact title/copy spacing. Shared papers are white, container-radius and spacious. Report panels add a quiet border. Pricing reuses one three-card partial on home and pricing pages: the middle card is forest with a yellow action; its siblings remain white. Displayed offers are (9,99 €), (49,99 €) and (149 €), with professional/agency actions leading to contact. The paid single report has 24-hour browser access; the other offers are enquiries, not subscription checkout.

### Shared Page Patterns

`section` selects white, sage or soft tone; `section-heading` selects centered or left alignment. `feature-grid` controls the four/three-column variants. `benefit-list` supports ruled benefits or numbered steps. `photo-story` pairs licensed illustrative photography with copy and visible credits. `hero` supplies the common light inner-page introduction; `search-form` preserves one address-search grammar.

The common layout owns exactly one FAQ and one closing forest search section. FAQ items use native details/summary with a simple plus/minus affordance. Final search reuses the same working form. Results, contact and report pages inherit these foundations rather than creating a new shell.

### Report Evidence

`report-preview` renders two overlapping white papers using actual labelled demo transactions and the shared `money` formatter. `report-showcase` reuses type links, section links, photo/data summary, chart and history table. Chart, history and property-data partials also serve the full report. The chart's accessible label describes its plotted years and prices; fewer than two points produce a readable fallback. Demonstration notices remain visible in both previews and full reports.

## Do's and Don'ts

### Do:

- **Do** reuse the shared Blade components and partials across marketing and operating pages.
- **Do** keep demo labels and illustrative-photo credits visible beside their evidence.
- **Do** preserve explicit focus, active navigation, native form validation and reduced-motion behavior.
- **Do** reuse the shared pricing partial, including its contact-only professional offers.
- **Do** keep a single FAQ and final search in the common layout.

### Don't:

- **Don't** introduce AI claims, fabricated testimonials, partner logos, usage totals or unsupported valuation features.
- **Don't** replace the supplied light report-led homepage direction with a full-bleed photo hero.
- **Don't** add small decorative tags, placeholder icons or a yellow featured-pricing background.
- **Don't** turn illustrative records or photography into claims about a real listed property.
