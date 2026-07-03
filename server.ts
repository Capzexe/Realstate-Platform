import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config({ path: '.env.local' }); // local overrides
dotenv.config();                        // fallback to .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Security headers (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet({ contentSecurityPolicy: false })); // CSP disabled: Vite injects inline scripts in dev

// Rate limiting — prevent abuse of data/payment endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,                   // max 60 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." }
});
app.use("/api/", apiLimiter);

// Parse JSON — explicit 50kb body size limit to prevent payload flooding
app.use(express.json({
  limit: "50kb",
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));

// Initialize Supabase Client if environment variables are provided
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

if (supabase) {
  console.log("Supabase Client initialized successfully!");
} else {
  console.log("Supabase credentials not configured yet. Running in offline/fallback mode.");
}

// Initialize Stripe Client if secret key is provided
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any
}) : null;

if (stripe) {
  console.log("Stripe integration initialized successfully!");
} else {
  console.log("Stripe SECRET_KEY not configured yet. Running in simulation mode.");
}


// Row type matching the property_transactions table in Supabase
interface PropertyTransactionRow {
  id: number;
  transaction_id: number;
  transaction_count: number;
  transaction_date: string;
  price_eur: number;
  object_type: string;
  address: string;
  county: string;
  city: string;
  parish: string;
  property_cadastre_nr: string;
  land_cadastre_nrs: string;
  land_share_numerator: number;
  land_share_denominator: number;
  land_area_m2: number;
  nilm_group_code: string;
  nilm_codes: string;
  building_count: string;
  building_cadastre_nr: string;
  building_use_type: string;
  building_use_code: string;
  building_floors: string;
  building_footprint_m2: string;
  building_area_m2: string;
  building_volume_m3: string;
  wall_material: string;
  construction_year: string;
  depreciation: string;
  all_building_cadastre_nrs: string;
  apartment_area_m2: string;
  room_count: string;
  bedroom_count: string;
  xml_wall_material: string;
  [key: string]: any;
}

const PROPERTIES_DB: Record<string, any> = {
  "prop_1": {
    id: "prop_1",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    beds: 3,
    baths: 2,
    sqft: 1800,
    yearBuilt: 1995,
    propertyType: "Single Family Residential",
    teaserImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600",
    price: 1245000,
    estimatedValue: 1280000,
    ownerName: "Robert & Mary Henderson",
    history: [
      { id: "tx_101", date: "2024-11-12", price: 1245000, type: "Sale", buyer: "Robert Henderson", seller: "James Sterling", documentNumber: "DOC-2024-99812" },
      { id: "tx_102", date: "2018-05-30", price: 980000, type: "Sale", buyer: "James Sterling", seller: "Alvin Vance", documentNumber: "DOC-2018-44109" },
      { id: "tx_103", date: "2012-02-14", price: 740000, type: "Sale", buyer: "Alvin Vance", seller: "Developer Group LLC", documentNumber: "DOC-2012-11029" },
      { id: "tx_104", date: "2025-01-15", price: 0, type: "Tax Assessment", documentNumber: "TAX-2025-001" }
    ],
    taxHistory: [
      { year: 2025, landValue: 400000, buildingValue: 845000, totalValue: 1245000, taxAmount: 14500 },
      { year: 2024, landValue: 380000, buildingValue: 800000, totalValue: 1180000, taxAmount: 13800 },
      { year: 2023, landValue: 360000, buildingValue: 750000, totalValue: 1110000, taxAmount: 12900 },
      { year: 2022, landValue: 350000, buildingValue: 720000, totalValue: 1070000, taxAmount: 12400 }
    ],
    comparableSales: [
      { address: "145 Main St, New York, NY", price: 1290000, date: "2025-03-10", beds: 3, baths: 2.5, sqft: 1950, distanceMiles: 0.1 },
      { address: "88 Lexington Ave, New York, NY", price: 1180000, date: "2024-09-22", beds: 3, baths: 2, sqft: 1720, distanceMiles: 0.3 },
      { address: "202 E 25th St, New York, NY", price: 1350000, date: "2025-02-18", beds: 4, baths: 3, sqft: 2100, distanceMiles: 0.4 }
    ]
  },
  "prop_2": {
    id: "prop_2",
    address: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    beds: 4,
    baths: 3.5,
    sqft: 3200,
    yearBuilt: 2008,
    propertyType: "Modern Craftsmanship Home",
    teaserImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
    price: 2850000,
    estimatedValue: 2920000,
    ownerName: "The Jenkins Living Trust",
    history: [
      { id: "tx_201", date: "2025-04-02", price: 2850000, type: "Sale", buyer: "Jenkins Living Trust", seller: "Markham Dev Corp", documentNumber: "DOC-2025-88120" },
      { id: "tx_202", date: "2019-10-18", price: 2100000, type: "Sale", buyer: "Markham Dev Corp", seller: "Patricia Geller", documentNumber: "DOC-2019-20984" },
      { id: "tx_203", date: "2010-06-11", price: 1450000, type: "Sale", buyer: "Patricia Geller", seller: "Original Builder Inc", documentNumber: "DOC-2010-00451" }
    ],
    taxHistory: [
      { year: 2025, landValue: 900000, buildingValue: 1950000, totalValue: 2850000, taxAmount: 32100 },
      { year: 2024, landValue: 850000, buildingValue: 1800000, totalValue: 2650000, taxAmount: 29800 },
      { year: 2023, landValue: 800000, buildingValue: 1700000, totalValue: 2500000, taxAmount: 28100 }
    ],
    comparableSales: [
      { address: "410 Oak Ave, Los Angeles, CA", price: 2790000, date: "2025-05-12", beds: 4, baths: 3, sqft: 3100, distanceMiles: 0.05 },
      { address: "122 Walnut Dr, Los Angeles, CA", price: 3100000, date: "2025-01-20", beds: 5, baths: 4, sqft: 3600, distanceMiles: 0.45 },
      { address: "550 Maple St, Los Angeles, CA", price: 2650000, date: "2024-11-05", beds: 3, baths: 2.5, sqft: 2800, distanceMiles: 0.6 }
    ]
  },
  "prop_3": {
    id: "prop_3",
    address: "789 Pine Rd",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    beds: 2,
    baths: 1.5,
    sqft: 1100,
    yearBuilt: 1920,
    propertyType: "Historic Brick Townhouse",
    teaserImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
    price: 420000,
    estimatedValue: 435000,
    ownerName: "Sarah J. Montgomery",
    history: [
      { id: "tx_301", date: "2023-08-15", price: 420000, type: "Sale", buyer: "Sarah J. Montgomery", seller: "David L. Ross", documentNumber: "DOC-2023-11204" },
      { id: "tx_302", date: "2015-11-20", price: 340000, type: "Sale", buyer: "David L. Ross", seller: "Estate of Arthur Vance", documentNumber: "DOC-2015-77401" },
      { id: "tx_303", date: "2005-03-05", price: 210000, type: "Sale", buyer: "Arthur Vance", seller: "Midwest Realty Partners", documentNumber: "DOC-2005-00192" }
    ],
    taxHistory: [
      { year: 2025, landValue: 120000, buildingValue: 300000, totalValue: 420000, taxAmount: 6800 },
      { year: 2024, landValue: 115000, buildingValue: 290000, totalValue: 405000, taxAmount: 6500 },
      { year: 2023, landValue: 110000, buildingValue: 280000, totalValue: 390000, taxAmount: 6300 }
    ],
    comparableSales: [
      { address: "765 Pine Rd, Chicago, IL", price: 415000, date: "2024-12-10", beds: 2, baths: 1.5, sqft: 1050, distanceMiles: 0.05 },
      { address: "812 Spruce St, Chicago, IL", price: 440000, date: "2025-04-18", beds: 3, baths: 2, sqft: 1300, distanceMiles: 0.25 },
      { address: "140 W Elm St, Chicago, IL", price: 395000, date: "2023-10-02", beds: 2, baths: 1, sqft: 980, distanceMiles: 0.5 }
    ]
  }
};

// Keeps track of which sessions have paid for which properties
// Acts as the validated Stripe payments lookup table
const PAID_REPORTS: Record<string, { propertyId: string; timestamp: number; singleUseToken: string }> = {};

// Evict PAID_REPORTS entries older than 24h when cache exceeds 1000 entries
function evictExpiredPaidReports() {
  const keys = Object.keys(PAID_REPORTS);
  if (keys.length < 1000) return;
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const key of keys) {
    if (PAID_REPORTS[key].timestamp < cutoff) delete PAID_REPORTS[key];
  }
}

// generateDynamicMockProperty removed — data is now served live from property_transactions

// ENDPOINT 1: Search property_transactions table
app.post("/api/search-property", async (req, res) => {
  const { address_query } = req.body;
  if (!address_query || typeof address_query !== "string") {
    return res.status(400).json({ found: false, error: "Nepieciešama derīga īpašuma adrese" });
  }
  if (address_query.trim().length > 200) {
    return res.status(400).json({ found: false, error: "Meklēšanas vaicājums ir pārāk garš." });
  }
  if (!supabase) {
    return res.status(503).json({ found: false, error: "Datubāze nav konfigurēta." });
  }

  // Strip ILIKE wildcards to prevent pattern injection; split on comma to allow "Street, City" searches
  const parts = address_query.trim().split(/,\s*/);
  const mainQuery = parts[0].replace(/[%_]/g, '').trim();
  const cityQuery = parts[1]?.replace(/[%_]/g, '').trim() || '';

  if (!mainQuery) {
    return res.status(400).json({ found: false, error: "Nepieciešama derīga īpašuma adrese" });
  }

  // Fetch only teaser columns — price is never included here
  let dbQuery = supabase
    .from("property_transactions")
    .select("id, transaction_date, object_type, address, county, city, parish, property_cadastre_nr, land_area_m2, building_area_m2, building_floors, construction_year, wall_material, room_count, xml_wall_material")
    .or(`address.ilike.%${mainQuery}%,property_cadastre_nr.ilike.%${mainQuery}%`);

  if (cityQuery) {
    dbQuery = dbQuery.ilike('city', `%${cityQuery}%`);
  } else {
    // Also allow city/county match when no comma separator given
    dbQuery = supabase
      .from("property_transactions")
      .select("id, transaction_date, object_type, address, county, city, parish, property_cadastre_nr, land_area_m2, building_area_m2, building_floors, construction_year, wall_material, room_count, xml_wall_material")
      .or(`address.ilike.%${mainQuery}%,city.ilike.%${mainQuery}%,county.ilike.%${mainQuery}%,property_cadastre_nr.ilike.%${mainQuery}%`);
  }

  const { data, error } = await dbQuery
    .order("transaction_date", { ascending: false })
    .limit(1);

  if (error) {
    console.error("[Search] Supabase error:", error);
    return res.status(500).json({ found: false, error: "Datubāzes vaicājuma kļūda." });
  }

  if (!data || data.length === 0) {
    return res.json({ found: false, error: "Nevar atrast īpašumu ar šādu adresi." });
  }

  const row = data[0];

  // Count all transactions for this cadastre number
  let transactionCount = 1;
  if (row.property_cadastre_nr) {
    const { count } = await supabase
      .from("property_transactions")
      .select("*", { count: "exact", head: true })
      .eq("property_cadastre_nr", row.property_cadastre_nr);
    transactionCount = count || 1;
  }

  const teaser = {
    id: String(row.id),
    address: row.address || "",
    city: row.city || "",
    county: row.county || "",
    parish: row.parish || "",
    object_type: row.object_type || "",
    building_area_m2: row.building_area_m2 || "",
    construction_year: row.construction_year || "",
    wall_material: row.wall_material || row.xml_wall_material || "",
    building_floors: row.building_floors || "",
    room_count: row.room_count || "",
    land_area_m2: row.land_area_m2 || 0,
    latest_transaction_date: row.transaction_date || "",
    transaction_count: transactionCount,
  };

  console.log(`[Search] Found: ${teaser.address}, ${transactionCount} darījumi`);
  return res.json({ found: true, property: teaser });
});

// ENDPOINT 2: Create Checkout Session
// Generates a checkout url (real Stripe or beautifully simulated Stripe Checkout)
app.post("/api/create-checkout-session", async (req, res) => {
  const { property_id } = req.body;
  if (!property_id || typeof property_id !== "string") {
    return res.status(400).json({ error: "Property ID is required" });
  }
  if (property_id.length > 100) {
    return res.status(400).json({ error: "Invalid property ID." });
  }

  // Look up the transaction row to get the property address for Stripe
  let propertyAddress = `Īpašums #${property_id}`;
  let propertyCity = "";
  if (supabase) {
    const { data } = await supabase
      .from("property_transactions")
      .select("address, city")
      .eq("id", property_id)
      .single();
    if (data) {
      propertyAddress = data.address || propertyAddress;
      propertyCity = data.city || "";
    }
  }

  if (!supabase) {
    return res.status(503).json({ error: "Datubāze nav konfigurēta." });
  }
  const { data: existsCheck, error: existsErr } = await supabase
    .from("property_transactions")
    .select("id")
    .eq("id", property_id)
    .single();
  if (existsErr || !existsCheck) {
    return res.status(404).json({ error: "Property ID not found" });
  }

  const checkoutSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;

  // If Stripe API key exists, we can use Stripe SDK (real integration flow)
  if (stripe) {
    try {
      const appUrl = process.env.APP_URL || "http://localhost:3000";
      const cleanAppUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `Darījumu vēstures atskaite - ${propertyAddress}`,
                description: `Pilna hronoloģiskā darījumu vērtību atskaite adresē: ${propertyAddress}${propertyCity ? ", " + propertyCity : ""}`,
              },
              unit_amount: 999, // 9.99 EUR
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${cleanAppUrl}/?session_id={CHECKOUT_SESSION_ID}&property_id=${property_id}&paid=true`,
        cancel_url: `${cleanAppUrl}/?property_id=${property_id}`,
        metadata: {
          property_id: property_id,
        },
      });

      return res.json({
        sessionId: session.id,
        checkoutUrl: session.url,
        isSimulated: false
      });
    } catch (stripeErr: any) {
      console.error("Stripe Checkout creation failed, falling back to simulation:", stripeErr.message);
    }
  }

  // We return a simulation response containing the session ID. 
  // The frontend can open a realistic mock checkout or redirect with this token
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const cleanAppUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;
  const mockCheckoutUrl = `${cleanAppUrl}/checkout-simulation?session_id=${checkoutSessionId}&property_id=${property_id}`;

  return res.json({
    sessionId: checkoutSessionId,
    checkoutUrl: mockCheckoutUrl,
    isSimulated: true
  });
});

// ENDPOINT 3: Secure Stripe Webhook Handling (Real structure + simulation)
// Verifies Stripe webhook event, updates PAID_REPORTS with property access
app.post("/api/webhook/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (stripe && sig && webhookSecret) {
    let event;
    try {
      const payload = (req as any).rawBody || req.body;
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const propertyId = session.metadata?.property_id;
      const singleUseToken = `tok_secure_${Math.random().toString(36).substring(2, 18)}`;
      evictExpiredPaidReports();
      PAID_REPORTS[session.id] = {
        propertyId,
        timestamp: Date.now(),
        singleUseToken
      };
        if (supabase) {
        const { error } = await supabase.from("paid_sessions").upsert({
            session_id: session.id,
            property_id: propertyId,
            single_use_token: singleUseToken
          });
          if (error && error.code !== 'PGRST205') console.error("[Stripe Webhook] Supabase paid_sessions insert error:", error);
        }
      console.log(`[Stripe Webhook] Verified real Stripe payment completed for Property: ${propertyId}`);
    }
    return res.json({ received: true });
  }

  // Mock / Simulation endpoint payload handling (triggered during user simulation flow)
  // SECURITY: Block simulation entirely when Stripe is fully configured in production.
  // Without this, any caller could POST a fake payload and unlock a report for free.
  if (stripe && process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(403).json({ error: "Webhook simulation is disabled in production mode." });
  }

  const { eventType, session_id, property_id } = req.body;
  if (eventType === "checkout.session.completed" && session_id && property_id) {
    const singleUseToken = `tok_secure_${Math.random().toString(36).substring(2, 18)}`;
    evictExpiredPaidReports();
    PAID_REPORTS[session_id] = {
      propertyId: property_id,
      timestamp: Date.now(),
      singleUseToken
    };
    if (supabase) {
      const { error } = await supabase.from("paid_sessions").upsert({
        session_id,
        property_id,
        single_use_token: singleUseToken
      });
      if (error && error.code !== 'PGRST205') console.error("[Webhook] Supabase paid_sessions insert error:", error);
    }
    console.log(`[Webhook] Payment verified via secure simulated webhook for property: ${property_id}`);
    return res.json({ received: true, simulated: true, token: singleUseToken });
  }

  return res.status(400).json({ error: "Invalid simulated webhook call or raw signature check failed" });
});

// ENDPOINT 4: Secure Data Fetch
// Only returns the sensitive sales data IF a valid session or single-use token matches the property ID
app.get("/api/get-report", async (req, res) => {
  const { session_id, property_id } = req.query;

  if (!session_id || !property_id) {
    return res.status(400).json({ success: false, error: "Missing session_id or property_id" });
  }

  let isVerified = false;

  // 1. Check if we have a record in memory (works for simulation and webhook completions)
  const record = PAID_REPORTS[session_id as string];
  if (record && record.propertyId === property_id) {
    const elapsed = Date.now() - record.timestamp;
    if (elapsed < 24 * 60 * 60 * 1000) { // 24-hour validity
      isVerified = true;
    }
  }

  // 1b. Fallback to Supabase paid_sessions (survives server restarts)
  if (!isVerified && supabase) {
    try {
      const { data, error } = await supabase
        .from("paid_sessions")
        .select("property_id, created_at")
        .eq("session_id", session_id)
        .single();
      if (data && !error && data.property_id === property_id) {
        const elapsed = Date.now() - new Date(data.created_at).getTime();
        if (elapsed < 24 * 60 * 60 * 1000) {
          isVerified = true;
          // Warm the in-memory cache
          PAID_REPORTS[session_id as string] = {
            propertyId: data.property_id,
            timestamp: new Date(data.created_at).getTime(),
            singleUseToken: ""
          };
        }
      }
    } catch (err) {
      console.error("Supabase paid_sessions lookup error:", err);
    }
  }

  // 2. If Stripe is configured, directly query Stripe API to verify session status as double security
  if (!isVerified && stripe && typeof session_id === "string" && !session_id.startsWith("cs_test_")) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session && session.payment_status === "paid" && session.metadata?.property_id === property_id) {
        isVerified = true;
        // Cache it in memory so subsequent fast requests don't hit Stripe rate limits
        if (!PAID_REPORTS[session_id]) {
          PAID_REPORTS[session_id] = {
            propertyId: property_id as string,
            timestamp: Date.now(),
            singleUseToken: `tok_secure_${Math.random().toString(36).substring(2, 18)}`
          };
        }
      }
    } catch (stripeErr: any) {
      console.error("Stripe session verification failed:", stripeErr.message);
    }
  }

  if (!isVerified) {
    return res.status(403).json({ 
      success: false, 
      error: "Access Denied. No verified purchase found for this transaction report. Please complete payment." 
    });
  }

  // Fetch full report from property_transactions table
  if (!supabase) {
    return res.status(503).json({ success: false, error: "Datubāze nav konfigurēta." });
  }

  // Fetch the anchor row
  const { data: anchor, error: anchorErr } = await supabase
    .from("property_transactions")
    .select("*")
    .eq("id", property_id)
    .single();

  if (anchorErr || !anchor) {
    return res.status(404).json({ success: false, error: "Īpašums nav atrasts." });
  }

  // Fetch all transactions for the same cadastre number
  let allTransactions: PropertyTransactionRow[] = [anchor];
  if (anchor.property_cadastre_nr) {
    const { data: txs } = await supabase
      .from("property_transactions")
      .select("*")
      .eq("property_cadastre_nr", anchor.property_cadastre_nr)
      .order("transaction_date", { ascending: false });
    if (txs && txs.length > 0) allTransactions = txs;
  }

  const report = {
    id: String(anchor.id),
    address: anchor.address || "",
    city: anchor.city || "",
    county: anchor.county || "",
    parish: anchor.parish || "",
    object_type: anchor.object_type || "",
    building_area_m2: anchor.building_area_m2 || "",
    construction_year: anchor.construction_year || anchor.xml_construction_year || "",
    wall_material: anchor.wall_material || anchor.xml_wall_material || "",
    building_floors: anchor.building_floors || "",
    room_count: anchor.room_count || "",
    land_area_m2: anchor.land_area_m2 || 0,
    latest_transaction_date: anchor.transaction_date || "",
    transaction_count: allTransactions.length,
    transactions: allTransactions,
    property_cadastre_nr: anchor.property_cadastre_nr || "",
    land_cadastre_nrs: anchor.land_cadastre_nrs || "",
    building_footprint_m2: anchor.building_footprint_m2 || "",
    building_volume_m3: anchor.building_volume_m3 || "",
    building_use_type: anchor.building_use_type || "",
    building_use_code: anchor.building_use_code || "",
    depreciation: anchor.depreciation || "",
    apartment_area_m2: anchor.apartment_area_m2 || "",
    bedroom_count: anchor.bedroom_count || "",
    nilm_group_code: anchor.nilm_group_code || "",
    nilm_codes: anchor.nilm_codes || "",
    building_cadastre_nr: anchor.building_cadastre_nr || "",
    all_building_cadastre_nrs: anchor.all_building_cadastre_nrs || "",
  };

  console.log(`[Report] Delivering ${allTransactions.length} darījumi for ${anchor.address}`);
  return res.json({ success: true, report });
});

// API helper to check if a specific session is already paid
app.get("/api/check-session", async (req, res) => {
  const { session_id } = req.query;
  if (!session_id || typeof session_id !== "string") {
    return res.json({ paid: false });
  }

  // Check in memory first
  if (PAID_REPORTS[session_id]) {
    return res.json({ paid: true, propertyId: PAID_REPORTS[session_id].propertyId });
  }

  // Query Stripe as fallback if it's a real session
  if (stripe && !session_id.startsWith("cs_test_")) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session && session.payment_status === "paid" && session.metadata?.property_id) {
        const propertyId = session.metadata.property_id;
        PAID_REPORTS[session_id] = {
          propertyId,
          timestamp: Date.now(),
          singleUseToken: `tok_secure_${Math.random().toString(36).substring(2, 18)}`
        };
        return res.json({ paid: true, propertyId });
      }
    } catch (err) {
      console.error("Stripe check session error:", err);
    }
  }

  return res.json({ paid: false });
});

// Set up Vite / static file serving
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite middleware in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production files from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Property Search Server running at http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start property search app server:", err);
});
