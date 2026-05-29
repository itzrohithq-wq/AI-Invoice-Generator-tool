import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Eye, EyeOff, Save, RotateCcw, AlertCircle, Settings, Download, Share, Mail, Copy, Send, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

// Import types
import { InvoiceData, EmailData, PreviewTab, BusinessInfoTab, InputMode } from '../types/invoice';

// Import constants
import { INITIAL_INVOICE_DATA, SAMPLE_INVOICE_DATA, INITIAL_EMAIL_DATA, MOCK_EXTRACTED_DATA } from '../constants/invoice';

// Import utilities
import { formatDate, generateEmailSubject, generateEmailBody, createEmailUrl } from '../utils/invoice';
import { generateTemplate, parseTemplate } from '../utils/templateParser';
import { printInvoice } from '../utils/printInvoice';

// Import form sections
import { InvoiceDetailsSection, BusinessInformationSection, ProjectFinancialOverviewSection, PaymentScheduleSection, PaymentMethodsSection, AdditionalNotesSection } from './invoice/FormSections';

// Import email components
import { SendOptions, EmailComposer, EmailPreviewContent } from './invoice/EmailComponents';

// Import preview components
import { PaymentPageContent, InvoicePreviewContent } from './invoice/PreviewComponents';

export function InvoiceGenerator() {
  // State management
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    const saved = localStorage.getItem('invoice_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
    return SAMPLE_INVOICE_DATA;
  });
  const [showPreview, setShowPreview] = useState(true);
  const [activePreviewTab, setActivePreviewTab] = useState<PreviewTab>('invoice');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [businessInfoTab, setBusinessInfoTab] = useState<BusinessInfoTab>('company');
  const [inputMode, setInputMode] = useState<InputMode>('manual');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [emailData, setEmailData] = useState<EmailData>(INITIAL_EMAIL_DATA);
  const [emailRecipient, setEmailRecipient] = useState('');

  // Refs for scrolling to sections
  const invoiceDetailsRef = useRef<HTMLDivElement>(null);
  const businessInfoRef = useRef<HTMLDivElement>(null);
  const projectFinancialRef = useRef<HTMLDivElement>(null);
  const paymentScheduleRef = useRef<HTMLDivElement>(null);
  const paymentMethodsRef = useRef<HTMLDivElement>(null);
  const additionalNotesRef = useRef<HTMLDivElement>(null);

  // Calculate totals whenever line items or tax rate changes
  useEffect(() => {
    const subtotal = invoiceData.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (invoiceData.taxRate / 100);
    const total = subtotal + taxAmount;

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  }, [invoiceData.lineItems, invoiceData.taxRate]);

  // Calculate payment schedule amounts when total or schedule changes
  useEffect(() => {
    if (invoiceData.paymentScheduleType === 'installments') {
      setInvoiceData(prev => ({
        ...prev,
        paymentSchedule: prev.paymentSchedule.map(payment => ({
          ...payment,
          amount: (prev.total * payment.percentage) / 100
        }))
      }));
    }
  }, [invoiceData.total, invoiceData.paymentSchedule.map(p => p.percentage).join(','), invoiceData.paymentScheduleType]);

  // Auto-populate email data when entering email composer mode
  useEffect(() => {
    if (showEmailComposer) {
      const subject = generateEmailSubject(invoiceData);
      const body = generateEmailBody(invoiceData, formatDate);

      setEmailData(prev => ({
        ...prev,
        to: invoiceData.clientEmail,
        subject,
        body
      }));
    }
  }, [showEmailComposer, invoiceData]);

  // Handle tab changes and sync navigation
  useEffect(() => {
    if (showEmailComposer || showSendOptions) return; // Don't scroll when in email mode

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    switch (activePreviewTab) {
      case 'invoice':
        // Show from Invoice Details to Additional Notes
        scrollToSection(invoiceDetailsRef);
        break;
      case 'payment':
        // Show from Payment Schedule to Additional Notes
        scrollToSection(paymentScheduleRef);
        break;
      case 'email':
        // Focus on email editing functionality
        setShowEmailComposer(true);
        break;
    }
  }, [activePreviewTab, showEmailComposer, showSendOptions]);

  // Initialize email recipient
  useEffect(() => {
    setEmailRecipient(invoiceData.clientEmail);
  }, [invoiceData.clientEmail]);

  // Event handlers
  const handleInputChange = (field: keyof InvoiceData, value: string | number | boolean) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('invoice_draft', JSON.stringify(invoiceData));
    toast.success('Invoice draft saved successfully!');
  };

  const handleReset = () => {
    setInvoiceData({ ...INITIAL_INVOICE_DATA });
    localStorage.removeItem('invoice_draft');
    setResetDialogOpen(false);
    
    setEmailData(INITIAL_EMAIL_DATA);
    setShowEmailComposer(false);
    setShowSendOptions(false);
    setActivePreviewTab('invoice');
    setInputMode('manual');
    setExtractedData(null);
    
    toast.success('Invoice form has been reset to defaults!');
  };

  // File template download helper
  const downloadTemplate = (type: 'company' | 'client' | 'invoice') => {
    const content = generateTemplate(type);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} template downloaded!`);
  };

  // File upload and extraction handlers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    
    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'json' && extension !== 'txt') {
      setIsExtracting(false);
      toast.error('AI Extraction is offline. Please use the formatted JSON or TXT templates instead.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setIsExtracting(false);
        toast.error('Failed to read file contents.');
        return;
      }

      // Small delay to simulate processing feedback
      await new Promise(resolve => setTimeout(resolve, 800));

      const parsed = parseTemplate(text, file.name);
      if (parsed) {
        // If it's a full invoice template
        if (parsed.invoiceNumber || parsed.lineItems) {
          setInvoiceData(prev => ({
            ...prev,
            ...parsed
          }));
          toast.success('Full invoice template loaded successfully!');
          setIsExtracting(false);
          return;
        }

        // Map parsed fields to extractedData format
        const companyData = {
          name: parsed.companyName || '',
          email: parsed.companyEmail || '',
          address: parsed.companyAddress || '',
          businessId1Label: parsed.businessId1Label || '',
          businessId1Value: parsed.businessId1Value || '',
          businessId2Label: parsed.businessId2Label || '',
          businessId2Value: parsed.businessId2Value || ''
        };

        const clientData = {
          name: parsed.clientName || '',
          email: parsed.clientEmail || '',
          address: parsed.clientAddress || ''
        };

        setExtractedData({
          company: companyData,
          client: clientData
        });
        
        toast.success('Document template parsed successfully! Review the extracted data below.');
      } else {
        toast.error('Could not parse template. Please check the file formatting.');
      }
      setIsExtracting(false);
    };
    
    reader.onerror = () => {
      setIsExtracting(false);
      toast.error('Error reading template file.');
    };
    
    reader.readAsText(file);
  };

  const applyExtractedData = (type: 'company' | 'client') => {
    if (!extractedData) return;

    const data = extractedData[type];
    if (type === 'company') {
      setInvoiceData(prev => ({
        ...prev,
        companyName: data.name,
        companyEmail: data.email,
        companyAddress: data.address,
        businessId1Label: data.businessId1Label,
        businessId1Value: data.businessId1Value,
        businessId2Label: data.businessId2Label,
        businessId2Value: data.businessId2Value,
      }));
    } else {
      setInvoiceData(prev => ({
        ...prev,
        clientName: data.name,
        clientEmail: data.email,
        clientAddress: data.address,
      }));
    }
  };

  // Email handlers
  const handleEmailInputChange = (field: keyof EmailData, value: string | boolean) => {
    setEmailData(prev => ({ ...prev, [field]: value }));
  };

  const handleShowSendOptions = () => {
    setShowSendOptions(true);
  };

  const handleSendViaProvider = (provider: 'gmail' | 'outlook' | 'yahoo' | 'default') => {
    const url = createEmailUrl(provider, emailData);
    window.open(url, '_blank');
    
    setShowEmailComposer(false);
    setShowSendOptions(false);
    toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} opened in new tab with your composed email!`);
  };

  const handleBackToInvoice = () => {
    setShowEmailComposer(false);
    setShowSendOptions(false);
    setActivePreviewTab('invoice');
  };

  const handleBackToComposer = () => {
    setShowSendOptions(false);
  };

  // Invoice action handlers
  const handleDownload = () => {
    printInvoice(invoiceData);
    toast.success('Invoice print/download dialog opened!');
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const handleEmailFromInvoice = () => {
    setActivePreviewTab('email');
  };

  const handleCopyLink = () => {
    const shareableLink = `https://invoice.app/view/${invoiceData.invoiceNumber}`;
    navigator.clipboard.writeText(shareableLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    toast.success('Shareable link copied to clipboard!');
  };

  const handleSocialShare = (platform: string) => {
    const shareText = `Invoice ${invoiceData.invoiceNumber} for ${invoiceData.clientName}`;
    const shareUrl = `https://invoice.app/view/${invoiceData.invoiceNumber}`;
    
    let url = '';
    switch (platform) {
      case 'slack':
        url = `slack://channel?team=&id=&message=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'discord':
        // Discord doesn't have direct URL scheme, show copy message
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast.success('Link copied! Paste it in Discord.');
        return;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
    setShareDialogOpen(false);
  };

  // Updated email send handler to redirect to send options
  const handleSendEmail = () => {
    if (!emailRecipient) {
      toast.error('Please enter a recipient email address');
      return;
    }
    
    // Update email data with recipient
    setEmailData(prev => ({ ...prev, to: emailRecipient }));
    
    // Auto-populate email data
    const subject = generateEmailSubject(invoiceData);
    const body = generateEmailBody(invoiceData, formatDate);

    setEmailData(prev => ({
      ...prev,
      to: emailRecipient,
      subject,
      body
    }));

    // Show send options for email client selection
    setShowSendOptions(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-1.5 text-slate-900 font-bold text-[20px]">
            {showSendOptions ? 'Send Email' : showEmailComposer ? 'Email Composer' : 'ITZROHITHQ® Invoice Generator'}
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto font-normal text-sm">
            {showSendOptions 
              ? 'Choose your preferred email client to send the invoice'
              : showEmailComposer 
                ? 'Compose and edit your invoice email with auto-populated details'
                : 'Streamline your invoicing—from draft to delivery'
            }
          </p>
        </div>

        {/* Preview Toggle Button - Mobile Only */}
        <div className="mb-6 flex justify-center lg:hidden">
          <Button 
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className={`space-y-8 ${showPreview ? 'lg:block' : 'block'}`}>
            {showSendOptions ? (
              <SendOptions
                emailData={emailData}
                invoiceData={invoiceData}
                onEmailInputChange={handleEmailInputChange}
                onBackToInvoice={handleBackToInvoice}
                onBackToComposer={handleBackToComposer}
                onShowSendOptions={handleShowSendOptions}
                onSendViaGmail={() => handleSendViaProvider('gmail')}
                onSendViaOutlook={() => handleSendViaProvider('outlook')}
                onSendViaYahoo={() => handleSendViaProvider('yahoo')}
                onSendViaDefault={() => handleSendViaProvider('default')}
              />
            ) : showEmailComposer ? (
              <EmailComposer
                emailData={emailData}
                invoiceData={invoiceData}
                onEmailInputChange={handleEmailInputChange}
                onBackToInvoice={handleBackToInvoice}
                onBackToComposer={handleBackToComposer}
                onShowSendOptions={handleShowSendOptions}
                onSendViaGmail={() => handleSendViaProvider('gmail')}
                onSendViaOutlook={() => handleSendViaProvider('outlook')}
                onSendViaYahoo={() => handleSendViaProvider('yahoo')}
                onSendViaDefault={() => handleSendViaProvider('default')}
              />
            ) : (
              <>
                <div ref={invoiceDetailsRef}>
                  <InvoiceDetailsSection
                    invoiceData={invoiceData}
                    onInputChange={handleInputChange}
                  />
                </div>

                <div ref={businessInfoRef}>
                  <BusinessInformationSection
                    invoiceData={invoiceData}
                    businessInfoTab={businessInfoTab}
                    inputMode={inputMode}
                    isExtracting={isExtracting}
                    extractedData={extractedData}
                    fileInputRef={fileInputRef}
                    onInputChange={handleInputChange}
                    setBusinessInfoTab={setBusinessInfoTab}
                    setInputMode={setInputMode}
                    handleFileUpload={handleFileUpload}
                    applyExtractedData={applyExtractedData}
                    downloadTemplate={downloadTemplate}
                  />
                </div>

                <div ref={projectFinancialRef}>
                  <ProjectFinancialOverviewSection
                    invoiceData={invoiceData}
                    onInputChange={handleInputChange}
                  />
                </div>

                <div ref={paymentScheduleRef}>
                  <PaymentScheduleSection
                    invoiceData={invoiceData}
                    onInputChange={handleInputChange}
                  />
                </div>

                <div ref={paymentMethodsRef}>
                  <PaymentMethodsSection
                    invoiceData={invoiceData}
                    onInputChange={handleInputChange}
                  />
                </div>

                <div ref={additionalNotesRef}>
                  <AdditionalNotesSection
                    invoiceData={invoiceData}
                    onInputChange={handleInputChange}
                  />
                </div>

                {/* Save & Reset Buttons */}
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={handleSave}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-200 px-8 py-3 h-auto"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Invoice
                  </Button>
                  
                  <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 px-8 py-3 h-auto"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Reset
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" aria-describedby="reset-dialog-description">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <RotateCcw className="w-5 h-5 text-orange-600" />
                          Reset Invoice Form
                        </DialogTitle>
                        <DialogDescription id="reset-dialog-description">
                          This will clear all current invoice data and reset the form to default values. This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <p className="text-orange-700 text-sm">
                            <AlertCircle className="w-4 h-4 inline mr-2" />
                            This will clear all current invoice data and reset the form to default values. This action cannot be undone.
                          </p>
                        </div>
                        
                        <div className="text-sm text-slate-600">
                          <p className="mb-2"><strong>What will be reset:</strong></p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>All invoice details and numbers</li>
                            <li>Company and client information</li>
                            <li>Line items and pricing</li>
                            <li>Payment methods and schedules</li>
                            <li>Notes and additional information</li>
                          </ul>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button 
                            onClick={() => setResetDialogOpen(false)}
                            variant="outline"
                            className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleReset}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Form
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
          </div>

          {/* Responsive Invoice Preview Section */}
          <div className={`${showPreview ? 'block' : 'hidden'} lg:block`}>
            <Card className="sticky top-6 border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
              {/* Preview Header with Navigation */}
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-slate-700 text-lg font-medium flex items-center gap-2">
                    Preview
                    <Settings className="w-4 h-4 text-slate-500" />
                  </h2>
                </div>
                
                {/* Navigation Tabs */}
                <div className="flex border-b border-slate-200">
                  <button
                    onClick={() => setActivePreviewTab('invoice')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activePreviewTab === 'invoice'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Invoice PDF
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('payment')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activePreviewTab === 'payment'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Payment page
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('email')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activePreviewTab === 'email'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Email
                  </button>
                </div>

              </CardHeader>

              <CardContent className="p-0">
                <div className="p-6">
                  {/* Tab Content */}
                  {activePreviewTab === 'invoice' && (
                    <div className="space-y-6">
                      <InvoicePreviewContent invoiceData={invoiceData} />
                      
                      {/* Improved Action Buttons - Center aligned and larger */}
                      <div className="flex justify-center gap-3 pt-4 border-t border-slate-200">
                        <Button 
                          onClick={handleEmailFromInvoice}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 px-6 py-3 h-auto"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        <Button 
                          onClick={handleDownload}
                          variant="outline"
                          className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 px-6 py-3 h-auto"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          onClick={handleShare}
                          variant="outline"
                          className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 px-6 py-3 h-auto"
                        >
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  )}
                  {activePreviewTab === 'email' && (
                    <div className="space-y-4">
                      <EmailPreviewContent invoiceData={invoiceData} emailData={emailData} />
                      
                      {/* Send Email Section */}
                      <div className="border-t border-slate-200 pt-4">
                        <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                          <h4 className="text-slate-900 font-medium">Send Email</h4>
                          <div className="space-y-2">
                            <Input
                              type="email"
                              placeholder="client@company.com"
                              value={emailRecipient}
                              onChange={(e) => setEmailRecipient(e.target.value)}
                              className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            />
                          </div>
                          <Button
                            onClick={handleSendEmail}
                            disabled={!emailRecipient}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Invoice Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {activePreviewTab === 'payment' && <PaymentPageContent invoiceData={invoiceData} />}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-md" aria-describedby="share-dialog-description">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share className="w-5 h-5 text-blue-600" />
                Share Invoice
              </DialogTitle>
              <DialogDescription id="share-dialog-description">
                Share your invoice with clients or team members using these options.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Shareable Link */}
              <div className="space-y-3">
                <h4 className="text-slate-900 font-medium">Shareable Link</h4>
                <div className="flex gap-2">
                  <Input
                    value={`https://invoice.app/view/${invoiceData.invoiceNumber}`}
                    readOnly
                    className="bg-slate-50 border-slate-200 text-slate-600"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className={`${copiedLink ? 'bg-green-50 border-green-200 text-green-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {copiedLink && (
                  <p className="text-green-600 text-sm">Link copied to clipboard!</p>
                )}
              </div>

              {/* Social Share */}
              <div className="space-y-3">
                <h4 className="text-slate-900 font-medium">Share via Apps</h4>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => handleSocialShare('slack')}
                    variant="outline"
                    className="flex-col h-auto p-4 border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-200"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                      <ExternalLink className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-xs">Slack</span>
                  </Button>
                  <Button
                    onClick={() => handleSocialShare('discord')}
                    variant="outline"
                    className="flex-col h-auto p-4 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                      <ExternalLink className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-xs">Discord</span>
                  </Button>
                  <Button
                    onClick={() => handleSocialShare('whatsapp')}
                    variant="outline"
                    className="flex-col h-auto p-4 border-slate-200 text-slate-700 hover:bg-green-50 hover:border-green-200"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                      <ExternalLink className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}