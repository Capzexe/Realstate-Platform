# Portfolio release preparation

Mode: Operate for validation; Read for the existing-flow video page.

THESIS: Explain errors beside their fields in Latvian and demonstrate the actual protected purchase flow through native video, without changing the incumbent design.

OWN-WORLD: Shared heroes, typography, green/white surfaces, native controls and footer. Field errors add a restrained dark red semantic state with explicit text and linked input descriptions.

STORY: Submit invalid contact/search data, understand which field needs correction, preserve valid input and recover. Open /demo to watch the local fake-purchase flow with captions; production retains its stricter payment boundary.

FIRST VIEWPORT: Contact/search layouts are unchanged except error text below affected controls. The /demo route inherits the shared interior-photo hero and section heading, then a responsive native video player with no autoplay and an explicit fictional/test notice.

FORM: Local hardening and a precise extension of existing page templates; no new identity or comp round. All media is native browser capture, with provenance in public/ASSETS.md. Context/detector engine unavailable earlier this session; source and browser verification are used.

FINISH: UI implementation, native desktop/mobile evidence, separate review and this documentation handoff are complete. Independent review disposition: SHIP for the contact-validation and demo-video UI scope, with no material findings or recapture required. Deployment, external services, security certification and performance certification remain outside this disposition.

## Implementation and system comparison — 25 October 2026

This is an ordinary extension of the incumbent system. Contact and demo reuse the shared photographic inner hero, warm wash, local DM Sans/Instrument Serif fonts, green/white sections, paper, buttons, responsive shell, FAQ and closing search. The contact layout still stacks on mobile; the video fills its container at 16:9 with the existing container radius and forest background. No new visual world or shared token replacement was introduced. PRODUCT.md, DESIGN.md and .impeccable/design.json remain unchanged.

The shared field-error component and search/contact templates render Latvian messages adjacent to invalid controls, link them through aria-invalid and aria-describedby, and retain usable entered values after server validation. app.js keeps native validation, supplies Latvian client messages, clears stale errors on input and focuses the first server-invalid field. app.css adds a scoped semantic error treatment: dark red (#923c32) text/border, a pale invalid background (#fff8f5), and lighter error text (#ffe4da) on the forest closing search. Explicit text and input associations carry the meaning alongside color. These states extend the documented native field/focus behavior without changing the control family.

The /demo page uses a native controls/playsinline player with no autoplay and preload="none", a real report poster, local WebM and default Latvian captions. It explicitly identifies fictional data, silent recording and local simulated payment; failure leaves the report locked and success opens the selected report. The production boundary remains visible. Current media lives in public/media/demo; public/ASSETS.md records native-capture provenance.

## Finished evidence and limits

- Native full-page, top-aligned evidence: artifacts/review/contact-desktop.png, contact-mobile.png, demo-desktop.png and demo-mobile.png. Desktop viewport width is 1280px; mobile is 390px at DPR 3. Contact evidence shows the inline email error with other input retained; demo evidence shows the player at 20 seconds with captions visible. All four were inspected for this handoff.
- Validation supplied by the release run: 68 PHP tests / 546 assertions, Pint and route cache passed. All six desktop/mobile browser checks passed before strengthening the seek assertion; subsequent targeted validation checks and video playback/captions/seek checks passed on both sizes. This records the completed checks without claiming a later full-suite rerun.
- Fresh independent review: SHIP for this UI scope, no material findings and no recapture. Earlier context/detector unavailability remains disclosed; source, native evidence and browser checks support this handoff. No Lighthouse score or deployment, email delivery, live Stripe, security or performance certification is asserted here.

Documentation drift observed without repair: DESIGN.md and the sidecar describe the incumbent field family but do not inventory these scoped error/video additions; their existing system remains authoritative. Asset provenance uses the current media/demo/ paths. No broader system drift assessment or repair was part of this handoff.
