-- ============================================================
-- VeriSale.ai — Supabase Schema & Seed Data
-- Run this entire file in: Supabase Dashboard > SQL Editor
-- ============================================================


-- ── 1. PROPERTIES TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id              TEXT PRIMARY KEY,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  zip             TEXT NOT NULL,
  beds            INTEGER NOT NULL,
  baths           NUMERIC(3,1) NOT NULL,
  sqft            INTEGER NOT NULL,
  year_built      INTEGER NOT NULL,
  property_type   TEXT NOT NULL,
  teaser_image    TEXT,
  price           NUMERIC(14,2) NOT NULL,
  estimated_value NUMERIC(14,2) NOT NULL,
  owner_name      TEXT NOT NULL,
  history         JSONB NOT NULL DEFAULT '[]',
  tax_history     JSONB NOT NULL DEFAULT '[]',
  comparable_sales JSONB NOT NULL DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- pg_trgm enables fast ILIKE/LIKE queries via trigram matching.
-- This is the correct index type for partial address string searches.
-- Without this, every search is a full table scan regardless of table size.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_properties_address_trgm  ON properties USING GIN (address  gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_city_trgm     ON properties USING GIN (city     gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_zip           ON properties (zip); -- exact match, btree is fine
CREATE INDEX IF NOT EXISTS idx_properties_state         ON properties (state);


-- ── 2. PAID SESSIONS TABLE ──────────────────────────────────
-- Persists Stripe payment confirmations so they survive server restarts
CREATE TABLE IF NOT EXISTS paid_sessions (
  session_id       TEXT PRIMARY KEY,
  property_id      TEXT NOT NULL,
  single_use_token TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-expire index (Supabase doesn't auto-delete, but useful for cleanup queries)
CREATE INDEX IF NOT EXISTS idx_paid_sessions_created ON paid_sessions (created_at);


-- ── 3. ROW LEVEL SECURITY ───────────────────────────────────
-- The server uses the SERVICE_ROLE key which bypasses RLS.
-- Enable RLS to block any accidental direct client access.
ALTER TABLE properties     ENABLE ROW LEVEL SECURITY;
ALTER TABLE paid_sessions  ENABLE ROW LEVEL SECURITY;

-- No public policies: only service_role (server) can read/write.


-- ── 4. SEED DATA — 3 Core Properties ───────────────────────

INSERT INTO properties (id, address, city, state, zip, beds, baths, sqft, year_built, property_type, teaser_image, price, estimated_value, owner_name, history, tax_history, comparable_sales)
VALUES (
  'prop_1',
  '123 Main St',
  'New York',
  'NY',
  '10001',
  3,
  2.0,
  1800,
  1995,
  'Single Family Residential',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600',
  1245000,
  1280000,
  'Robert & Mary Henderson',
  '[
    {"id":"tx_101","date":"2024-11-12","price":1245000,"type":"Sale","buyer":"Robert Henderson","seller":"James Sterling","documentNumber":"DOC-2024-99812"},
    {"id":"tx_102","date":"2018-05-30","price":980000,"type":"Sale","buyer":"James Sterling","seller":"Alvin Vance","documentNumber":"DOC-2018-44109"},
    {"id":"tx_103","date":"2012-02-14","price":740000,"type":"Sale","buyer":"Alvin Vance","seller":"Developer Group LLC","documentNumber":"DOC-2012-11029"},
    {"id":"tx_104","date":"2025-01-15","price":0,"type":"Tax Assessment","documentNumber":"TAX-2025-001"}
  ]',
  '[
    {"year":2025,"landValue":400000,"buildingValue":845000,"totalValue":1245000,"taxAmount":14500},
    {"year":2024,"landValue":380000,"buildingValue":800000,"totalValue":1180000,"taxAmount":13800},
    {"year":2023,"landValue":360000,"buildingValue":750000,"totalValue":1110000,"taxAmount":12900},
    {"year":2022,"landValue":350000,"buildingValue":720000,"totalValue":1070000,"taxAmount":12400}
  ]',
  '[
    {"address":"145 Main St, New York, NY","price":1290000,"date":"2025-03-10","beds":3,"baths":2.5,"sqft":1950,"distanceMiles":0.1},
    {"address":"88 Lexington Ave, New York, NY","price":1180000,"date":"2024-09-22","beds":3,"baths":2,"sqft":1720,"distanceMiles":0.3},
    {"address":"202 E 25th St, New York, NY","price":1350000,"date":"2025-02-18","beds":4,"baths":3,"sqft":2100,"distanceMiles":0.4}
  ]'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO properties (id, address, city, state, zip, beds, baths, sqft, year_built, property_type, teaser_image, price, estimated_value, owner_name, history, tax_history, comparable_sales)
VALUES (
  'prop_2',
  '456 Oak Ave',
  'Los Angeles',
  'CA',
  '90001',
  4,
  3.5,
  3200,
  2008,
  'Modern Craftsmanship Home',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
  2850000,
  2920000,
  'The Jenkins Living Trust',
  '[
    {"id":"tx_201","date":"2025-04-02","price":2850000,"type":"Sale","buyer":"Jenkins Living Trust","seller":"Markham Dev Corp","documentNumber":"DOC-2025-88120"},
    {"id":"tx_202","date":"2019-10-18","price":2100000,"type":"Sale","buyer":"Markham Dev Corp","seller":"Patricia Geller","documentNumber":"DOC-2019-20984"},
    {"id":"tx_203","date":"2010-06-11","price":1450000,"type":"Sale","buyer":"Patricia Geller","seller":"Original Builder Inc","documentNumber":"DOC-2010-00451"}
  ]',
  '[
    {"year":2025,"landValue":900000,"buildingValue":1950000,"totalValue":2850000,"taxAmount":32100},
    {"year":2024,"landValue":850000,"buildingValue":1800000,"totalValue":2650000,"taxAmount":29800},
    {"year":2023,"landValue":800000,"buildingValue":1700000,"totalValue":2500000,"taxAmount":28100}
  ]',
  '[
    {"address":"410 Oak Ave, Los Angeles, CA","price":2790000,"date":"2025-05-12","beds":4,"baths":3,"sqft":3100,"distanceMiles":0.05},
    {"address":"122 Walnut Dr, Los Angeles, CA","price":3100000,"date":"2025-01-20","beds":5,"baths":4,"sqft":3600,"distanceMiles":0.45},
    {"address":"550 Maple St, Los Angeles, CA","price":2650000,"date":"2024-11-05","beds":3,"baths":2.5,"sqft":2800,"distanceMiles":0.6}
  ]'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO properties (id, address, city, state, zip, beds, baths, sqft, year_built, property_type, teaser_image, price, estimated_value, owner_name, history, tax_history, comparable_sales)
VALUES (
  'prop_3',
  '789 Pine Rd',
  'Chicago',
  'IL',
  '60601',
  2,
  1.5,
  1100,
  1920,
  'Historic Brick Townhouse',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
  420000,
  435000,
  'Sarah J. Montgomery',
  '[
    {"id":"tx_301","date":"2023-08-15","price":420000,"type":"Sale","buyer":"Sarah J. Montgomery","seller":"David L. Ross","documentNumber":"DOC-2023-11204"},
    {"id":"tx_302","date":"2015-11-20","price":340000,"type":"Sale","buyer":"David L. Ross","seller":"Estate of Arthur Vance","documentNumber":"DOC-2015-77401"},
    {"id":"tx_303","date":"2005-03-05","price":210000,"type":"Sale","buyer":"Arthur Vance","seller":"Midwest Realty Partners","documentNumber":"DOC-2005-00192"}
  ]',
  '[
    {"year":2025,"landValue":120000,"buildingValue":300000,"totalValue":420000,"taxAmount":6800},
    {"year":2024,"landValue":115000,"buildingValue":290000,"totalValue":405000,"taxAmount":6500},
    {"year":2023,"landValue":110000,"buildingValue":280000,"totalValue":390000,"taxAmount":6300}
  ]',
  '[
    {"address":"765 Pine Rd, Chicago, IL","price":415000,"date":"2024-12-10","beds":2,"baths":1.5,"sqft":1050,"distanceMiles":0.05},
    {"address":"812 Spruce St, Chicago, IL","price":440000,"date":"2025-04-18","beds":3,"baths":2,"sqft":1300,"distanceMiles":0.25},
    {"address":"140 W Elm St, Chicago, IL","price":395000,"date":"2023-10-02","beds":2,"baths":1,"sqft":980,"distanceMiles":0.5}
  ]'
)
ON CONFLICT (id) DO NOTHING;
