import { InvoiceData, EmailData, Currency, PaymentMethod } from '../types/invoice';

export const DEFAULT_CURRENCIES: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', exchangeRate: 1.0, serviceFee: 0, serviceFeeType: 'fixed' },
  { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 0.012, serviceFee: 0, serviceFeeType: 'fixed' }
];

export const AVAILABLE_CURRENCIES: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', exchangeRate: 1.0, serviceFee: 0, serviceFeeType: 'fixed' },
  { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 0.012, serviceFee: 0, serviceFeeType: 'fixed' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', exchangeRate: 0.016, serviceFee: 2.5, serviceFeeType: 'percentage' },
  { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.011, serviceFee: 25, serviceFeeType: 'fixed' },
  { code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.0094, serviceFee: 3.0, serviceFeeType: 'percentage' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 1.88, serviceFee: 15, serviceFeeType: 'fixed' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', exchangeRate: 0.018, serviceFee: 2.0, serviceFeeType: 'percentage' }
];

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', name: 'Bank Transfer', enabled: true, processingFee: 0, processingFeeType: 'fixed', terms: 'Preferred method. No additional fees. Please include invoice number in payment reference.' },
  { id: '2', name: 'UPI / NetBanking', enabled: true, processingFee: 0, processingFeeType: 'fixed', terms: 'Instant UPI settlement via GPay/PhonePe/Paytm. Send to: billing@yourcompany@okaxis' }
];

export const AVAILABLE_PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', name: 'Bank Transfer', enabled: true, processingFee: 0, processingFeeType: 'fixed', terms: 'Preferred method. No additional fees. Please include invoice number in payment reference.' },
  { id: '2', name: 'UPI / NetBanking', enabled: true, processingFee: 0, processingFeeType: 'fixed', terms: 'Instant UPI settlement via GPay/PhonePe/Paytm. Send to: billing@yourcompany@okaxis' },
  { id: '3', name: 'Credit Card', enabled: true, processingFee: 2.5, processingFeeType: 'percentage', terms: 'Visa, MasterCard accepted. 2.5% gateway processing fee applies.' },
  { id: '4', name: 'Check', enabled: false, processingFee: 0, processingFeeType: 'fixed', terms: 'Allow 3-5 business days for clearance. Make payable to: Your Company Name' },
  { id: '5', name: 'PayPal', enabled: false, processingFee: 3.9, processingFeeType: 'percentage', terms: 'For international clients. 3.9% + standard conversion fees apply.' }
];

export const INITIAL_INVOICE_DATA: InvoiceData = {
  invoiceNumber: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  projectName: '',
  projectDescription: '',
  showProjectInfo: true,
  lineItems: [
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
  ],
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  total: 0,
  notes: '',
  companyName: '',
  companyAddress: '',
  companyEmail: '',
  paymentInstructions: 'Payment is due within 30 days of invoice date. Please include invoice number with payment.',
  businessId1Label: '',
  businessId1Value: '',
  businessId2Label: '',
  businessId2Value: '',
  paymentScheduleType: 'one-time',
  paymentSchedule: [
    { 
      id: '1', 
      percentage: 50, 
      dueDate: new Date().toISOString().split('T')[0], 
      amount: 0, 
      description: 'Initial payment' 
    },
    { 
      id: '2', 
      percentage: 50, 
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      amount: 0, 
      description: 'Final payment' 
    }
  ],
  baseCurrency: 'INR',
  acceptedCurrencies: DEFAULT_CURRENCIES,
  showAcceptedCurrencies: true,
  paymentMethods: DEFAULT_PAYMENT_METHODS,
  showPaymentMethods: true,
  exchangeRatePolicy: 'Exchange rates are updated daily and locked at time of invoice generation. Rates may vary for payments made after 30 days from invoice date.',
  showExchangeRatePolicy: false,
  generalServiceFee: 0,
  generalServiceFeeType: 'fixed',
  currencySpecificTerms: 'Currency conversion fees may apply for international payments. All fees are clearly disclosed before processing. Contact us for current rates and terms for large transactions.',
  showCurrencySpecificTerms: false,
  logoUrl: ''
};

export const SAMPLE_INVOICE_DATA: InvoiceData = {
  invoiceNumber: '00001',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  clientName: 'Acme Corporation',
  clientEmail: 'billing@acme.com',
  clientAddress: '123 Business Ave\nNew York, NY 10001\nPhone: (555) 123-4567',
  projectName: 'Website Redesign',
  projectDescription: 'Complete website redesign including UX/UI design, frontend development, and responsive implementation',
  showProjectInfo: true,
  lineItems: [
    { id: '1', description: 'UX/UI Design', quantity: 1, rate: 85000, amount: 85000 },
    { id: '2', description: 'Frontend Development', quantity: 40, rate: 4000, amount: 160000 },
    { id: '3', description: 'Responsive Implementation', quantity: 1, rate: 30000, amount: 30000 }
  ],
  subtotal: 0,
  taxRate: 18.0, // Standard Indian GST
  taxAmount: 0,
  total: 0,
  notes: 'Thank you for your business! Payment is due within 30 days.',
  companyName: 'ITZROHITHQ® Studio',
  companyAddress: '456 Creative Street\nDesign City, MH 400001\nPhone: +91 98765 43210',
  companyEmail: 'hello@itzrohithq.com',
  paymentInstructions: 'Payment is due within 30 days of invoice date. Please include invoice number with payment. We accept UPI, NetBanking, Bank Transfers, and Credit Cards as outlined below.',
  businessId1Label: 'GSTIN',
  businessId1Value: '27AAAAA1111A1Z1',
  businessId2Label: 'PAN',
  businessId2Value: 'ABCDE1234F',
  paymentScheduleType: 'one-time',
  paymentSchedule: [
    { 
      id: '1', 
      percentage: 50, 
      dueDate: new Date().toISOString().split('T')[0], 
      amount: 0, 
      description: 'Initial payment' 
    },
    { 
      id: '2', 
      percentage: 50, 
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      amount: 0, 
      description: 'Final payment' 
    }
  ],
  baseCurrency: 'INR',
  acceptedCurrencies: [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', exchangeRate: 1.0, serviceFee: 0, serviceFeeType: 'fixed' },
    { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 0.012, serviceFee: 0, serviceFeeType: 'fixed' }
  ],
  showAcceptedCurrencies: true,
  paymentMethods: [
    { id: '1', name: 'Bank Transfer', enabled: true, processingFee: 0, processingFeeType: 'fixed', terms: 'Preferred method. No additional fees. Please include invoice number in payment reference.' },
    { id: '2', name: 'UPI / NetBanking', enabled: true, processingFee: 0, processingFeeType: 'fixed', terms: 'Instant UPI settlement via GPay/PhonePe/Paytm. Send to: billing@yourcompany@okaxis' }
  ],
  showPaymentMethods: true,
  exchangeRatePolicy: 'Exchange rates are updated daily and locked at time of invoice generation. Rates may vary for payments made after 30 days from invoice date.',
  showExchangeRatePolicy: false,
  generalServiceFee: 0,
  generalServiceFeeType: 'fixed',
  currencySpecificTerms: 'Currency conversion fees may apply for international payments. All fees are clearly disclosed before processing. Contact us for current rates and terms for large transactions.',
  showCurrencySpecificTerms: false,
  logoUrl: ''
};

export const INITIAL_EMAIL_DATA: EmailData = {
  to: '',
  cc: '',
  bcc: '',
  subject: '',
  body: '',
  attachInvoice: true,
  priority: 'normal'
};

export const MOCK_EXTRACTED_DATA = {
  company: {
    name: 'TechCorp Solutions Inc.',
    email: 'billing@techcorp.com',
    address: '789 Innovation Drive\nSan Francisco, CA 94105\nPhone: (415) 555-0123',
    businessId1Label: 'Federal Tax ID',
    businessId1Value: '12-3456789',
    businessId2Label: 'State License',
    businessId2Value: 'CA-2024-567890'
  },
  client: {
    name: 'Global Enterprises Ltd.',
    email: 'accounts@globalent.com',
    address: '456 Commerce Plaza\nNew York, NY 10001\nPhone: (212) 555-0456'
  }
};