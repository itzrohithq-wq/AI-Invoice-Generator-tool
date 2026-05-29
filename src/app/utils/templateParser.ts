import { InvoiceData } from '../types/invoice';

export const generateTemplate = (type: 'company' | 'client' | 'invoice'): string => {
  if (type === 'company') {
    return JSON.stringify({
      companyName: "Acme Creative Studio LLC",
      companyEmail: "hello@acmecreative.com",
      companyAddress: "123 Innovation Way, Suite 400\nSan Francisco, CA 94107\nPhone: (555) 019-2834",
      businessId1Label: "Tax ID",
      businessId1Value: "99-8887776",
      businessId2Label: "Business License",
      businessId2Value: "LIC-776655"
    }, null, 2);
  }
  if (type === 'client') {
    return JSON.stringify({
      clientName: "Global Tech Enterprise Inc",
      clientEmail: "accounts@globaltech.com",
      clientAddress: "456 Enterprise Boulevard\nNew York, NY 10001\nPhone: (555) 024-5678"
    }, null, 2);
  }
  // Full Invoice
  return JSON.stringify({
    invoiceNumber: "INV-2026-001",
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: "Acme Creative Studio LLC",
    companyEmail: "hello@acmecreative.com",
    companyAddress: "123 Innovation Way, Suite 400\nSan Francisco, CA 94107\nPhone: (555) 019-2834",
    businessId1Label: "Tax ID",
    businessId1Value: "99-8887776",
    businessId2Label: "Business License",
    businessId2Value: "LIC-776655",
    clientName: "Global Tech Enterprise Inc",
    clientEmail: "accounts@globaltech.com",
    clientAddress: "456 Enterprise Boulevard\nNew York, NY 10001\nPhone: (555) 024-5678",
    projectName: "E-Commerce App Redesign",
    projectDescription: "UX Design workshop, Figma mockups, and Tailwind implementation",
    showProjectInfo: true,
    taxRate: 8.5,
    notes: "Thank you for partnering with Acme Creative Studio!",
    paymentInstructions: "Please send payment via bank transfer to Acme Creative Studio LLC, Account: 123456789, Route: 987654321.",
    baseCurrency: "USD",
    lineItems: [
      { id: "1", description: "UX Design Workshop & Discovery", quantity: 1, rate: 2500, amount: 2500 },
      { id: "2", description: "Figma High-Fidelity UI Designs", quantity: 1, rate: 3500, amount: 3500 },
      { id: "3", description: "Tailwind CSS React Frontend Integration", quantity: 40, rate: 125, amount: 5000 }
    ],
    paymentScheduleType: "one-time",
    paymentSchedule: [
      { id: "1", percentage: 50, dueDate: new Date().toISOString().split('T')[0], amount: 5500, description: "Initial Deposit" },
      { id: "2", percentage: 50, dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 5500, description: "Project Launch" }
    ],
    showAcceptedCurrencies: true,
    showPaymentMethods: true
  }, null, 2);
};

export const parseTemplate = (content: string, filename: string): Partial<InvoiceData> | null => {
  const lowercaseFilename = filename.toLowerCase();
  
  if (lowercaseFilename.endsWith('.json')) {
    try {
      const parsed = JSON.parse(content);
      const result: Partial<InvoiceData> = {};
      
      const fields: Array<keyof InvoiceData> = [
        'invoiceNumber', 'date', 'dueDate', 'clientName', 'clientEmail', 'clientAddress',
        'projectName', 'projectDescription', 'showProjectInfo', 'taxRate', 'notes',
        'companyName', 'companyAddress', 'companyEmail', 'paymentInstructions',
        'businessId1Label', 'businessId1Value', 'businessId2Label', 'businessId2Value',
        'paymentScheduleType', 'baseCurrency', 'showAcceptedCurrencies', 'showPaymentMethods',
        'lineItems', 'paymentSchedule', 'acceptedCurrencies', 'paymentMethods'
      ];
      
      fields.forEach(field => {
        if (parsed[field] !== undefined) {
          result[field] = parsed[field];
        }
      });
      
      // Map company structure if nested
      if (parsed.company && typeof parsed.company === 'object') {
        const c = parsed.company;
        if (c.name) result.companyName = c.name;
        if (c.email) result.companyEmail = c.email;
        if (c.address) result.companyAddress = c.address;
        if (c.taxId) {
          result.businessId1Label = "Tax ID";
          result.businessId1Value = c.taxId;
        }
        if (c.license) {
          result.businessId2Label = "Business License";
          result.businessId2Value = c.license;
        }
        if (c.businessId1Label) result.businessId1Label = c.businessId1Label;
        if (c.businessId1Value) result.businessId1Value = c.businessId1Value;
        if (c.businessId2Label) result.businessId2Label = c.businessId2Label;
        if (c.businessId2Value) result.businessId2Value = c.businessId2Value;
      }
      
      // Map client structure if nested
      if (parsed.client && typeof parsed.client === 'object') {
        const cl = parsed.client;
        if (cl.name) result.clientName = cl.name;
        if (cl.email) result.clientEmail = cl.email;
        if (cl.address) result.clientAddress = cl.address;
      }
      
      return Object.keys(result).length > 0 ? result : null;
    } catch (e) {
      console.error("JSON parse error:", e);
      return null;
    }
  }
  
  if (lowercaseFilename.endsWith('.txt')) {
    const result: Partial<InvoiceData> = {};
    const lines = content.split('\n');
    
    const getValueForLabel = (label: string): string | null => {
      const regex = new RegExp(`^${label}\\s*:\\s*(.*)$`, 'i');
      for (const line of lines) {
        const match = line.match(regex);
        if (match) return match[1].trim();
      }
      return null;
    };
    
    const companyName = getValueForLabel('Company Name');
    if (companyName) result.companyName = companyName;
    const companyEmail = getValueForLabel('Company Email');
    if (companyEmail) result.companyEmail = companyEmail;
    const companyAddress = getValueForLabel('Company Address');
    if (companyAddress) result.companyAddress = companyAddress.replace(/\\n/g, '\n');
    
    const businessId1Label = getValueForLabel('Business ID 1 Label') || getValueForLabel('Tax ID Label');
    if (businessId1Label) result.businessId1Label = businessId1Label;
    const businessId1Value = getValueForLabel('Business ID 1 Value') || getValueForLabel('Tax ID');
    if (businessId1Value) result.businessId1Value = businessId1Value;
    
    const businessId2Label = getValueForLabel('Business ID 2 Label') || getValueForLabel('License Label');
    if (businessId2Label) result.businessId2Label = businessId2Label;
    const businessId2Value = getValueForLabel('Business ID 2 Value') || getValueForLabel('License');
    if (businessId2Value) result.businessId2Value = businessId2Value;
    
    const clientName = getValueForLabel('Client Name');
    if (clientName) result.clientName = clientName;
    const clientEmail = getValueForLabel('Client Email');
    if (clientEmail) result.clientEmail = clientEmail;
    const clientAddress = getValueForLabel('Client Address');
    if (clientAddress) result.clientAddress = clientAddress.replace(/\\n/g, '\n');
    
    const projectName = getValueForLabel('Project Name');
    if (projectName) result.projectName = projectName;
    const projectDescription = getValueForLabel('Project Description');
    if (projectDescription) result.projectDescription = projectDescription;
    
    const invoiceNumber = getValueForLabel('Invoice Number') || getValueForLabel('Invoice No');
    if (invoiceNumber) result.invoiceNumber = invoiceNumber;
    
    const date = getValueForLabel('Issue Date') || getValueForLabel('Date');
    if (date) result.date = date;
    const dueDate = getValueForLabel('Due Date');
    if (dueDate) result.dueDate = dueDate;
    
    const taxRate = getValueForLabel('Tax Rate');
    if (taxRate) result.taxRate = parseFloat(taxRate) || 0;
    
    const notes = getValueForLabel('Notes');
    if (notes) result.notes = notes;
    
    const paymentInstructions = getValueForLabel('Payment Instructions');
    if (paymentInstructions) result.paymentInstructions = paymentInstructions;
    
    return Object.keys(result).length > 0 ? result : null;
  }
  
  return null;
};
