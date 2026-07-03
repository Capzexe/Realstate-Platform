export interface PropertyTransaction {
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
  building_share_numerator: string;
  building_share_denominator: string;
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
  room_group_count: string;
  apartment_count: string;
  room_group_cadastre_nr: string;
  room_group_share_numerator: string;
  room_group_share_denominator: string;
  room_group_use_code: string;
  room_group_floor_min: string;
  room_group_floor_max: string;
  room_group_area_m2: string;
  apartment_area_m2: string;
  room_count: string;
  bedroom_count: string;
  xml_construction_year: string;
  xml_wall_material: string;
}

export interface PropertyTeaser {
  id: string;
  address: string;
  city: string;
  county: string;
  parish: string;
  object_type: string;
  building_area_m2: string;
  construction_year: string;
  wall_material: string;
  building_floors: string;
  room_count: string;
  land_area_m2: number;
  latest_transaction_date: string;
  transaction_count: number;
}

export interface PropertyReport extends PropertyTeaser {
  transactions: PropertyTransaction[];
  property_cadastre_nr: string;
  land_cadastre_nrs: string;
  building_footprint_m2: string;
  building_volume_m3: string;
  building_use_type: string;
  building_use_code: string;
  depreciation: string;
  apartment_area_m2: string;
  bedroom_count: string;
  nilm_group_code: string;
  nilm_codes: string;
  building_cadastre_nr: string;
  all_building_cadastre_nrs: string;
}

export interface SearchResponse {
  found: boolean;
  property?: PropertyTeaser;
  error?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  checkoutUrl: string;
  isSimulated: boolean;
}

export interface ReportResponse {
  success: boolean;
  report?: PropertyReport;
  error?: string;
}
