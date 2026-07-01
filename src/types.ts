export interface Transaction {
  id: string;
  date: string;
  price: number;
  type: 'Sale' | 'Tax Assessment' | 'Foreclosure' | 'Refinance';
  buyer?: string;
  seller?: string;
  documentNumber: string;
}

export interface TaxRecord {
  year: number;
  landValue: number;
  buildingValue: number;
  totalValue: number;
  taxAmount: number;
}

export interface ComparableSale {
  address: string;
  price: number;
  date: string;
  beds: number;
  baths: number;
  sqft: number;
  distanceMiles: number;
}

export interface PropertyTeaser {
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
}

export interface PropertyReport extends PropertyTeaser {
  price: number; // Hidden until payment verified
  history: Transaction[]; // Hidden until payment verified
  taxHistory: TaxRecord[]; // Hidden until payment verified
  comparableSales: ComparableSale[]; // Hidden until payment verified
  estimatedValue: number; // Hidden until payment verified
  ownerName: string; // Hidden until payment verified
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
