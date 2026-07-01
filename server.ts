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


// In-memory property store (emulating a secure Supabase / Private Database)
interface Transaction {
  id: string;
  date: string;
  price: number;
  type: 'Sale' | 'Tax Assessment' | 'Foreclosure' | 'Refinance';
  buyer?: string;
  seller?: string;
  documentNumber: string;
}

interface TaxRecord {
  year: number;
  landValue: number;
  buildingValue: number;
  totalValue: number;
  taxAmount: number;
}

interface ComparableSale {
  address: string;
  price: number;
  date: string;
  beds: number;
  baths: number;
  sqft: number;
  distanceMiles: number;
}

interface PropertyReport {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  propertyType: string;
  teaserImage: string;
  price: number;
  estimatedValue: number;
  ownerName: string;
  history: Transaction[];
  taxHistory: TaxRecord[];
  comparableSales: ComparableSale[];
}

const PROPERTIES_DB: Record<string, PropertyReport> = {
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

// Helper to generate a random mock property dynamically if the user searches an address not in our core list
function generateDynamicMockProperty(address: string): PropertyReport {
  const cleanAddress = address.trim();
  const id = `prop_dyn_${Buffer.from(cleanAddress).toString('hex').slice(0, 10)}`;
  
  // Randomizer parameters based on address hash to keep it consistent
  let hash = 0;
  for (let i = 0; i < cleanAddress.length; i++) {
    hash = cleanAddress.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const beds = (hash % 3) + 2; // 2, 3, 4
  const baths = (hash % 2) === 0 ? beds - 1 : beds - 0.5; // realistic bed/bath ratio
  const sqft = ((hash % 15) * 150) + 1100; // 1100 to 3200 sqft
  const yearBuilt = 1950 + (hash % 70); // 1950 to 2020
  const price = ((hash % 180) * 10000) + 320000; // $320,000 to $2,120,000
  const estimatedValue = Math.round(price * (1 + ((hash % 10) / 100))); // estimate slightly higher
  
  // Choose random stock imagery
  const images = [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&q=80&w=600"
  ];
  const teaserImage = images[hash % images.length];

  const states = ["NY", "CA", "TX", "FL", "IL", "WA", "MA", "GA"];
  const cities = ["New York", "Los Angeles", "Austin", "Miami", "Chicago", "Seattle", "Boston", "Atlanta"];
  const chosenIdx = hash % states.length;

  const zip = String(10000 + (hash % 80000)).padStart(5, '0');

  const history: Transaction[] = [
    {
      id: `tx_dyn_1`,
      date: `2024-${String((hash % 11) + 1).padStart(2, '0')}-${String((hash % 25) + 1).padStart(2, '0')}`,
      price: price,
      type: 'Sale',
      buyer: `Purchaser ${hash % 100}`,
      seller: `Owner family LLC`,
      documentNumber: `DOC-2024-${hash % 90000 + 10000}`
    },
    {
      id: `tx_dyn_2`,
      date: `2017-${String((hash % 11) + 1).padStart(2, '0')}-${String((hash % 25) + 1).padStart(2, '0')}`,
      price: Math.round(price * 0.72),
      type: 'Sale',
      buyer: `Owner family LLC`,
      seller: `Predecessor estate`,
      documentNumber: `DOC-2017-${hash % 90000 + 10000}`
    }
  ];

  const taxHistory: TaxRecord[] = [
    { year: 2025, landValue: Math.round(price * 0.3), buildingValue: Math.round(price * 0.7), totalValue: price, taxAmount: Math.round(price * 0.011) },
    { year: 2024, landValue: Math.round(price * 0.29), buildingValue: Math.round(price * 0.68), totalValue: Math.round(price * 0.97), taxAmount: Math.round(price * 0.011 * 0.97) }
  ];

  const comparableSales: ComparableSale[] = [
    { address: `Nearby ${hash % 100} Ave, ${cities[chosenIdx]}, ${states[chosenIdx]}`, price: Math.round(price * 0.98), date: "2025-02-14", beds, baths, sqft: Math.round(sqft * 0.95), distanceMiles: 0.15 },
    { address: `Adjoining ${hash % 50} Road, ${cities[chosenIdx]}, ${states[chosenIdx]}`, price: Math.round(price * 1.05), date: "2025-04-10", beds, baths: baths + 0.5, sqft: Math.round(sqft * 1.08), distanceMiles: 0.3 }
  ];

  return {
    id,
    address: cleanAddress,
    city: cities[chosenIdx],
    state: states[chosenIdx],
    zip,
    beds,
    baths,
    sqft,
    yearBuilt,
    propertyType: "Single Family Residence",
    teaserImage,
    price,
    estimatedValue,
    ownerName: `Owner Trust #${hash % 500}`,
    history,
    taxHistory,
    comparableSales
  };
}

// ENDPOINT 1: Secure Search Property
// Input: address_query
// Returns: Teaser representation without structural price metadata (protects data before purchase)
app.post("/api/search-property", async (req, res) => {
  const { address_query } = req.body;
  if (!address_query || typeof address_query !== "string") {
    return res.status(400).json({ found: false, error: "Valid property address is required" });
  }
  if (address_query.trim().length > 200) {
    return res.status(400).json({ found: false, error: "Address query is too long." });
  }

  const query = address_query.trim().toLowerCase();
  let matchedProp: PropertyReport | undefined;

  // 1. Try querying Supabase if initialized
  if (supabase) {
    try {
      // Strip ILIKE wildcards from user input to prevent pattern injection
      const safeQuery = address_query.trim().replace(/[%_]/g, '');

      // Only select the 11 teaser columns — never fetch price/history/JSONB during a search.
      // Full data is only loaded after payment is verified in /api/get-report.
      const { data, error } = await supabase
        .from("properties")
        .select("id, address, city, state, zip, beds, baths, sqft, year_built, property_type, teaser_image")
        .or(`address.ilike.%${safeQuery}%,city.ilike.%${safeQuery}%,zip.eq.${safeQuery}`)
        .limit(1);

      if (error) {
        console.error("Supabase query error:", error);
      } else if (data && data.length > 0) {
        const row = data[0];
        // Build a teaser-only object. Sensitive fields left empty — filled later by get-report.
        matchedProp = {
          id: row.id,
          address: row.address,
          city: row.city,
          state: row.state,
          zip: row.zip,
          beds: row.beds,
          baths: Number(row.baths),
          sqft: row.sqft,
          yearBuilt: row.year_built,
          propertyType: row.property_type,
          teaserImage: row.teaser_image,
          price: 0,
          estimatedValue: 0,
          ownerName: "",
          history: [],
          taxHistory: [],
          comparableSales: []
        };
        // Don't cache in PROPERTIES_DB — full data will be fetched from Supabase on get-report
        console.log(`[Supabase] Found property: ${matchedProp.address}`);
      }
    } catch (err) {
      console.error("Error connecting to Supabase table:", err);
    }
  }

  // 2. Fallback to direct search in pre-defined PROPERTIES_DB
  if (!matchedProp) {
    matchedProp = Object.values(PROPERTIES_DB).find(
      p => p.address.toLowerCase().includes(query) || query.includes(p.address.toLowerCase())
    );
  }

  // 3. Generate dynamic fallback if still not found
  if (!matchedProp) {
    matchedProp = generateDynamicMockProperty(address_query);
    // Cap in-memory store at 500 entries to prevent memory exhaustion
    if (Object.keys(PROPERTIES_DB).length < 500) {
      PROPERTIES_DB[matchedProp.id] = matchedProp;
    }
  }

  // Strip secret transactional fields. Returning only safe teaser fields.
  const teaser = {
    id: matchedProp.id,
    address: matchedProp.address,
    city: matchedProp.city,
    state: matchedProp.state,
    zip: matchedProp.zip,
    beds: matchedProp.beds,
    baths: matchedProp.baths,
    sqft: matchedProp.sqft,
    yearBuilt: matchedProp.yearBuilt,
    propertyType: matchedProp.propertyType,
    teaserImage: matchedProp.teaserImage
  };

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

  // Find property in local cache or load from Supabase if not present
  let property = PROPERTIES_DB[property_id];
  if (!property && supabase) {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", property_id)
        .single();
      if (data && !error) {
        property = {
          id: data.id,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          beds: data.beds,
          baths: Number(data.baths),
          sqft: data.sqft,
          yearBuilt: data.year_built,
          propertyType: data.property_type,
          teaserImage: data.teaser_image,
          price: Number(data.price),
          estimatedValue: Number(data.estimated_value),
          ownerName: data.owner_name,
          history: data.history || [],
          taxHistory: data.tax_history || [],
          comparableSales: data.comparable_sales || []
        };
        PROPERTIES_DB[property_id] = property;
      }
    } catch (err) {
      console.error("Supabase load error during checkout session creation:", err);
    }
  }

  if (!property) {
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
                name: `Zemesgrāmatas aktu nodošanas ierakstu sertifikāts - ${property.address}`,
                description: `Pilna hronoloģiskā darījumu vērtību atskaite un īpašnieku vēsture adresē: ${property.address}, ${property.city}`,
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
        if (error) console.error("[Stripe Webhook] Supabase paid_sessions insert error:", error);
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
      if (error) console.error("[Webhook] Supabase paid_sessions insert error:", error);
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

  // Fetch report: first from memory, fallback to Supabase if available
  let fullReport = PROPERTIES_DB[property_id as string];
  if (!fullReport && supabase) {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", property_id)
        .single();
      if (data && !error) {
        fullReport = {
          id: data.id,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          beds: data.beds,
          baths: Number(data.baths),
          sqft: data.sqft,
          yearBuilt: data.year_built,
          propertyType: data.property_type,
          teaserImage: data.teaser_image,
          price: Number(data.price),
          estimatedValue: Number(data.estimated_value),
          ownerName: data.owner_name,
          history: data.history || [],
          taxHistory: data.tax_history || [],
          comparableSales: data.comparable_sales || []
        };
        PROPERTIES_DB[property_id as string] = fullReport;
      }
    } catch (err) {
      console.error("Supabase load error during report fetch:", err);
    }
  }

  if (!fullReport) {
    return res.status(404).json({ success: false, error: "Property report details not found." });
  }

  // Return full report securely. Now the price and full history are delivered!
  return res.json({
    success: true,
    report: fullReport
  });
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
