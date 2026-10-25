# Property purchase and local checkout

Mode: Operate. Extend the existing property/detail templates. The user requires an explicit fake purchase before any saved property's detailed information is shown.

## Direction contract

THESIS: Reference-led two-column checkout: a persistent order summary, fixed illustrative test card fields, then a separate, honest local processing screen before server confirmation.

OWN-WORLD: Inherit the established forest, sage, white papers, DM Sans and existing hero, section, data-grid and purchase-panel components.

STORY: Identify a property, open checkout, review the prefilled non-editable demo payment details, choose payment or rejection, observe processing, then receive a server-approved report or return to retry. Cancellation stays available. No actual card details are collected.

FIRST VIEWPORT: Shared navigation above a full-height split workspace, white order summary on the left and a pale canvas with a white payment paper on the right. No photo hero. The second screenshot pins a dark processing surface; translate it into incumbent forest with ordered, readable stages, without false Stripe/webhook claims. Mobile stacks order then form; existing FAQ and footer follow the workspace.

FORM: Precise structure pinned by the user's two screenshots on 2026-10-24; extend the existing checkout within the incumbent visual world. Launcher unavailable earlier in this session, so no generated seed key or new comp round. Signature interaction: four sequential local processing stages, then a real CSRF-protected confirmation POST. Reduced motion shortens the sequence; no-JavaScript has a manual confirmation button.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Completed review — 2026-10-24

Disposition: **ship**. The fresh finish reviewer returned no material findings or polish changes after reviewing the four current captures, both user-supplied reference images and the implementation. Documentation review confirms this is an ordinary extension of the incumbent system.

Evidence checked in `.impeccable/review/checkout-stages/`: `form-desktop.png` and `form-mobile.png` show the order summary beside, then above, the fixed demonstration payment fields; `processing-desktop.png` and `processing-mobile.png` show the separate forest processing paper with four ordered stages. These supersede the earlier six-capture immediate-confirmation review. The captures were compared with `resources/views/checkout/demo.blade.php`, `summary.blade.php`, `processing.blade.php`, the checkout block in `public/css/app.css`, the processing enhancement in `public/js/app.js`, and `DemoCheckoutController` with its authorized outcome request.

The pinned split-form composition and separate processing screen inherit DM Sans, forest, sage, white paper, quiet rules, existing button treatments and the shared navigation, FAQ, closing search and footer. The desktop summary persists across both screens; below the local 800px breakpoint it stacks above the form or processing paper. The processing heading receives focus on entry so the short sequence is visible on mobile; status text uses a live status region, the current step uses `aria-current`, and focus remains yellow on forest. Reduced motion shortens the sequence. Without JavaScript, a visible confirmation button and explanatory text complete the same server flow; returning from browser history restores that manual action.

Only local fake payments are represented. The readonly example fields have no submitted names, and the interface explicitly states that no real money is collected or card data sent or saved. Preparing an attempt stores the chosen success or failure scenario in the session and opens processing without granting report access. After the four visual stages, a CSRF-protected POST must pass browser ownership authorization and match the prepared session outcome before the controller can mark a successful demo purchase paid. Failure returns to checkout with the report locked; cancellation returns to the property with the report locked. The animation does not prove payment and makes no claim of Stripe or bank activity.

Money keeps the comma decimal separator, grouped spaces and euro suffix. Checkout composition, the local breakpoint, readonly fields and staged processing remain surface-specific extensions; no shared tokens or design-system rules changed. `DESIGN.md` and `.impeccable/design.json` are preserved. No new shipping raster assets were introduced; the four PNGs are review evidence.

Tooling context: the launcher was unavailable earlier in this session, so manual context and source review were used. The detector attempt could not cache its engine (0.1.5); no generated detector result or new seed key is claimed.

Pre-existing documentation drift, reported without repair: the sidecar FAQ example still says “Viena īsta īpašuma atskaite”, while PRODUCT.md now specifies purchase-gated access for every saved property, including fictional demo properties. This copy drift does not change the visual system.
