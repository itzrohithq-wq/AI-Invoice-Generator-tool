export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  serviceFee: number;
  serviceFeeType: 'fixed' | 'percentage';
  selected?: boolean; // For toggle selection in UI
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  processingFee: number;
  processingFeeType: 'fixed' | 'percentage';
  terms: string;
}

export interface PaymentSchedule {
  id: string;
  percentage: number;
  dueDate: string;
  amount: number;
  description: string;
}

// Contact Management Types
export interface SavedContact {
  id: string;
  type: 'company' | 'client';
  name: string;
  email: string;
  address: string;
  businessId1Label?: string;
  businessId1Value?: string;
  businessId2Label?: string;
  businessId2Value?: string;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean; // For company contacts - mark as default
}

export interface ContactList {
  companies: SavedContact[];
  clients: SavedContact[];
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  projectName: string;
  projectDescription: string;
  showProjectInfo: boolean;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  paymentInstructions: string;
  businessId1Label: string;
  businessId1Value: string;
  businessId2Label: string;
  businessId2Value: string;
  paymentScheduleType: 'one-time' | 'installments';
  paymentSchedule: PaymentSchedule[];
  baseCurrency: string;
  acceptedCurrencies: Currency[];
  showAcceptedCurrencies: boolean;
  paymentMethods: PaymentMethod[];
  showPaymentMethods: boolean; // New field to control payment methods visibility
  exchangeRatePolicy: string;
  showExchangeRatePolicy: boolean;
  generalServiceFee: number;
  generalServiceFeeType: 'fixed' | 'percentage';
  currencySpecificTerms: string;
  showCurrencySpecificTerms: boolean;
  logoUrl?: string;
}

export interface EmailData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  attachInvoice: boolean;
  priority: 'low' | 'normal' | 'high';
}

export type PreviewTab = 'invoice' | 'email' | 'payment';
export type BusinessInfoTab = 'company' | 'client';
export type InputMode = 'manual' | 'upload';