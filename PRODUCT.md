# VeriSale

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users and Purpose
Latvian property buyers, sellers, and professionals explore address/cadastre records and transaction history before making their own decisions.

## Stack
Existing Laravel 12 / PHP 8.4 application (verified on 8.4.27): Eloquent, SQLite, Blade, local CSS/JavaScript. No frontend build step.

## Capabilities and Constraints
Search, locked property previews, purchased reports, printable PDF through browser printing, CSV import, contact form, optional verified Stripe checkout. Twelve seeded demo properties across ten cities contain 36 fictional sales; every saved property requires a purchase to reveal its details. Local/test mode supports an explicit fake payment with success, failure and cancellation; it is disabled in production/staging and simulated purchases cannot grant access there. A report costs EUR 9.99 for 24 hours of browser-session access. Public marketing examples use unsaved illustrations separate from database properties. Professional/agency offers are contact enquiries. No AI functionality. Preserve the shared design and simple MVC structure.

## Brand Commitments
VeriSale name and Latvian interface. The user explicitly requests the supplied Estimo screenshot's styling and section structure for the homepage, then the same shared components for every other page. Keep small tags and placeholder icons out. The supplied reference overrides the old full-photo dark homepage hero. Inner-page heroes use contextual full-width background photos with a warm light wash behind dark text, as requested on 2026-10-24; retain the homepage's report-led search composition. Reuse the pricing template from the homepage on the pricing page. Include one FAQ at the bottom of each page.

## Evidence on Hand
Seeded property details and transactions, local licensed photographs and self-hosted fonts (public/ASSETS.md), existing working Laravel forms and routes. No verified customer testimonials, partner affiliations, usage totals, live registry connection, market valuation, or risk-detection feature; do not fabricate these.
