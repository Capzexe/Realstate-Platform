# Rebuild notes

The original application used React, a TypeScript Express server, and an unconfigured Supabase connection. A large unused mock database and process-local payment state made behavior difficult to follow and unreliable after restarts.

The rebuild keeps the visual assets and page structure while replacing the runtime with Laravel MVC:

- Eloquent and SQLite replace unavailable remote-data wiring and in-memory purchases.
- Normal Blade pages, shared partials, and local CSS/JavaScript replace the frontend build.
- Stripe Checkout uses the server's amount and verified payment details. Only Stripe's webhook signature verifier needs its SDK.
- Explicitly labelled seed records let a fresh installation work without external accounts.
- A validated CSV command supplies a simple path to an actual dataset.
- The contact form uses Laravel Mail, with an honest development log mode.

Read routes, then the corresponding controller, model, and view. Change one request flow at a time and run `composer test` after modifying access, imports, or integrations. The README contains installation and configuration instructions.
