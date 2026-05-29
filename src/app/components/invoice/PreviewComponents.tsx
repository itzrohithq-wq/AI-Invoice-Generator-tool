import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertCircle } from 'lucide-react';
import { InvoiceData } from '../../types/invoice';
import { formatDate, formatCurrency, convertCurrency, getTotalPercentage } from '../../utils/invoice';
import imgLogoImage from "figma:asset/9f2b02a70d969501a98e759282b75e264fcf1f41.png";

interface PreviewComponentsProps {
  invoiceData: InvoiceData;
}

export const PaymentPageContent: React.FC<PreviewComponentsProps> = ({ invoiceData }) => {
  const [selectedMethod, setSelectedMethod] = React.useState<string | null>(null);
  const [showUpload, setShowUpload] = React.useState(false);

  const handleMethodSelect = (methodId: string, methodName: string) => {
    setSelectedMethod(methodId);
    
    // Show different prompts based on payment method
    if (methodName.toLowerCase().includes('bank') || methodName.toLowerCase().includes('transfer')) {
      setShowUpload(true);
    } else if (methodName.toLowerCase().includes('paypal')) {
      // Simulate PayPal redirect
      alert('Redirecting to PayPal account linking...');
    } else {
      setShowUpload(false);
    }
  };

  // Determine if payment button should be enabled
  const isPaymentButtonEnabled = !invoiceData.showPaymentMethods || selectedMethod !== null;
  
  // Determine payment button text
  const getPaymentButtonText = () => {
    if (!invoiceData.showPaymentMethods) {
      return `Pay ${invoiceData.total.toFixed(2)} ${invoiceData.baseCurrency}`;
    }
    
    if (selectedMethod) {
      return `Pay ${invoiceData.total.toFixed(2)} ${invoiceData.baseCurrency}`;
    }
    
    return 'Select Payment Method';
  };

  return (
  <div className="bg-white relative rounded-2xl w-full min-h-[600px] overflow-hidden shadow-sm border border-slate-200">
    <div className="p-6 border-b border-slate-100">
      <h3 className="text-lg font-semibold text-slate-900">Payment Page Preview</h3>
      <p className="text-slate-600 text-sm">How clients will see your payment options</p>
    </div>
    
    <div className="p-6 space-y-6">
      {/* Invoice Summary */}
      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="font-medium text-slate-900 mb-3">Invoice Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Invoice #</span>
            <span className="text-slate-900">{invoiceData.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Due Date</span>
            <span className="text-slate-900">{formatDate(invoiceData.dueDate)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-slate-900">Total Amount</span>
            <span className="text-slate-900">{formatCurrency(invoiceData.total, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods - Only show if enabled */}
      {invoiceData.showPaymentMethods && (
        <div>
          <h4 className="font-medium text-slate-900 mb-3">Payment Methods</h4>
          <div className="space-y-3">
            {invoiceData.paymentMethods.filter(method => method.enabled).map((method) => (
              <div key={method.id} 
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedMethod === method.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 hover:border-blue-200'
                }`}
                onClick={() => handleMethodSelect(method.id, method.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedMethod === method.id 
                        ? 'bg-blue-500' 
                        : 'border border-slate-400'
                    }`}></div>
                    <span className="font-medium text-slate-900">{method.name}</span>
                  </div>
                  {method.processingFee > 0 && (
                    <Badge variant="outline" className="text-xs">
                      +{method.processingFee}{method.processingFeeType === 'percentage' ? '%' : ' fee'}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 ml-5">{method.terms}</p>
              </div>
            ))}
          </div>

          {/* Dynamic Payment Method Prompts */}
          {selectedMethod && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              {showUpload ? (
                <div className="space-y-4">
                  <h5 className="font-medium text-slate-900">Upload Payment Details</h5>
                  <p className="text-sm text-slate-600">
                    Please upload a void cheque or bank transfer details (PDF format)
                  </p>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                    <input type="file" accept=".pdf" className="hidden" />
                    <Button 
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                      variant="outline" 
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      Choose PDF File
                    </Button>
                    <p className="text-xs text-slate-500 mt-2">Drag and drop or click to browse</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h5 className="font-medium text-slate-900">Payment Setup</h5>
                  <p className="text-sm text-slate-600">
                    Continue with your selected payment method to complete the setup.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Continue Setup
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Message when payment methods are disabled */}
      {!invoiceData.showPaymentMethods && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-slate-900 mb-2">Payment Instructions</h4>
          <p className="text-sm text-slate-600">
            {invoiceData.paymentInstructions}
          </p>
        </div>
      )}

      {/* Currency Options - Only show if enabled */}
      {invoiceData.showAcceptedCurrencies && (
        <div>
          <h4 className="font-medium text-slate-900 mb-3">Currency</h4>
          <div className="grid grid-cols-2 gap-2">
            {invoiceData.acceptedCurrencies.map((currency) => (
              <div key={currency.code} className="border border-slate-200 rounded p-2 text-center hover:border-blue-200 cursor-pointer transition-colors">
                <div className="font-medium text-slate-900">{currency.code}</div>
                <div className="text-sm text-slate-600">{formatCurrency(convertCurrency(invoiceData.total, invoiceData.baseCurrency, currency.code, invoiceData.acceptedCurrencies), currency.code, invoiceData.acceptedCurrencies)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Schedule */}
      {invoiceData.paymentScheduleType === 'installments' && (
        <div>
          <h4 className="font-medium text-slate-900 mb-3">Payment Schedule</h4>
          <div className="space-y-2">
            {invoiceData.paymentSchedule.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                <div>
                  <span className="text-slate-900 text-sm font-medium">{payment.description}</span>
                  <p className="text-slate-600 text-xs">Due: {formatDate(payment.dueDate)}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-900 font-medium">{formatCurrency(payment.amount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</span>
                  <p className="text-slate-500 text-xs">{payment.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Button - Only show if payment methods are enabled OR if no payment methods required */}
      {invoiceData.showPaymentMethods && (
        <div className="pt-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isPaymentButtonEnabled}
          >
            {getPaymentButtonText()}
          </Button>
        </div>
      )}
    </div>
  </div>
  );
};

export const InvoicePreviewContent: React.FC<PreviewComponentsProps> = ({ invoiceData }) => (
  <div className="bg-white relative rounded-3xl w-full min-h-[600px] overflow-hidden shadow-inner border-8 border-slate-100">
    {/* Background Header - Expanded to cover client information */}
    <div className="absolute bg-slate-50 h-44 sm:h-52 md:h-60 left-2 sm:left-4 rounded-2xl top-2 sm:top-4 right-2 sm:right-4" />
    
    {/* Invoice Layout Grid */}
    <div className="relative p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      
      {/* Header Section with Client Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        {/* Left Column: Invoice Title + Client Information */}
        <div className="space-y-6">
          {/* Invoice Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-2">Invoice</h1>
          </div>
          
          {/* Client Information - Now in grey area with matching font size */}
          <div>
            <p className="text-slate-500 text-sm mb-2">Billed To:</p>
            <div>
              <h3 className="text-slate-900 text-sm mb-2">{invoiceData.clientName || 'Client Name'}</h3>
              <p className="text-slate-600 text-sm whitespace-pre-line">{invoiceData.clientAddress || 'Address / Contact Info'}</p>
            </div>
          </div>
        </div>
        
        {/* Right Column: Invoice Details */}
        <div className="text-right space-y-4">
          <div>
            <p className="text-slate-500 text-xs sm:text-sm">Invoice No.</p>
            <p className="text-slate-900 text-base sm:text-lg">#{invoiceData.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs sm:text-sm">Issued on</p>
            <p className="text-slate-900 text-sm">{formatDate(invoiceData.date)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs sm:text-sm">Payment Due</p>
            <p className="text-slate-900 text-sm">{formatDate(invoiceData.dueDate)}</p>
          </div>
        </div>
      </div>

      {/* Project Information Section - Independent section above Services */}
      {invoiceData.showProjectInfo && (
        <div className="pt-6 sm:pt-8">
          <h3 className="text-slate-900 text-lg sm:text-xl mb-4">Project Information</h3>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-slate-900 text-base mb-2">{invoiceData.projectName || 'Project Name'}</h4>
            <p className="text-slate-600 text-sm">{invoiceData.projectDescription || 'Project description'}</p>
          </div>
        </div>
      )}

      {/* Services Section */}
      <div className="pt-6 sm:pt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-900 text-lg sm:text-xl">Services</h3>
          <div className="hidden sm:grid grid-cols-3 gap-6 text-slate-500 text-sm min-w-[240px]">
            <span className="text-right">Qty.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>
        </div>

        {/* Service Items - Responsive Layout */}
        <div className="space-y-4 sm:space-y-6">
          {/* Individual Service Items */}
          {invoiceData.lineItems.map((item, index) => (
            <div key={item.id} className="border-b border-slate-100 pb-4">
              {/* Mobile Layout */}
              <div className="block sm:hidden">
                <p className="text-slate-900 mb-2">{item.description || `Service Item ${index + 1}`}</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-slate-500">Qty</p>
                    <p className="text-slate-700">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Rate</p>
                    <p className="text-slate-700">{formatCurrency(item.rate, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500">Total</p>
                    <p className="text-slate-900">{formatCurrency(item.amount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</p>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-slate-900 pr-4">{item.description || `Service Item ${index + 1}`}</p>
                </div>
                <div className="grid grid-cols-3 gap-6 text-sm min-w-[240px]">
                  <span className="text-slate-600 text-right tabular-nums">{item.quantity}</span>
                  <span className="text-slate-600 text-right tabular-nums">{formatCurrency(item.rate, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</span>
                  <span className="text-slate-900 text-right tabular-nums font-medium">{formatCurrency(item.amount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Section */}
      <div className="pt-8 flex justify-end">
        <div className="bg-slate-50 rounded-xl px-4 sm:px-6 py-4 w-full sm:w-auto sm:min-w-[280px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 text-sm">Total</span>
              <span className="text-slate-500 text-sm">({invoiceData.baseCurrency})</span>
            </div>
            <div className="text-slate-900 text-xl sm:text-2xl">{formatCurrency(invoiceData.total, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</div>
          </div>
        </div>
      </div>

      {/* Payment Schedule Section */}
      {invoiceData.paymentScheduleType === 'installments' && (
        <div className="pt-8 border-t border-slate-100">
          <h4 className="text-slate-900 text-sm mb-4">
            Payment Schedule
          </h4>
          <div className="space-y-3">
            {invoiceData.paymentSchedule.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-slate-900 text-sm">{payment.description}</p>
                  <p className="text-slate-500 text-xs">Due: {formatDate(payment.dueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 text-sm">{formatCurrency(payment.amount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</p>
                  <p className="text-slate-500 text-xs">{payment.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
          {getTotalPercentage(invoiceData.paymentSchedule) !== 100 && (
            <div className="mt-3 p-3 bg-orange-50 rounded-lg">
              <p className="text-orange-700 text-xs">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Payment schedule incomplete: {getTotalPercentage(invoiceData.paymentSchedule).toFixed(1)}% of total
              </p>
            </div>
          )}
        </div>
      )}

      {/* Payment Methods & Currencies Section - Only show if either is enabled */}
      {(invoiceData.showPaymentMethods || invoiceData.showAcceptedCurrencies) && (
        <div className="pt-8 border-t border-slate-100">
          <h3 className="text-slate-900 text-lg sm:text-xl mb-4">Payment Methods & Instructions</h3>
          
          {/* General Payment Instructions */}
          <div className="mb-6">
            <p className="text-slate-700 text-sm leading-relaxed">{invoiceData.paymentInstructions}</p>
          </div>
          
          {/* Payment Methods - Only show if enabled */}
          {invoiceData.showPaymentMethods && (
            <div className="mb-6">
              <p className="text-slate-500 text-sm mb-3">Accepted Payment Methods:</p>
              <div className="space-y-2">
                {invoiceData.paymentMethods.filter(method => method.enabled).map((method) => (
                  <div key={method.id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <span className="text-slate-900 text-sm">{method.name}</span>
                      {method.terms && (
                        <p className="text-slate-600 text-xs mt-1">{method.terms}</p>
                      )}
                    </div>
                    {method.processingFee > 0 && (
                      <Badge variant="outline" className="text-xs ml-3">
                        {method.processingFee}{method.processingFeeType === 'percentage' ? '%' : ' fee'}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Currencies - Only show if enabled */}
          {invoiceData.showAcceptedCurrencies && (
            <>
              <div className="mb-6">
                <p className="text-slate-500 text-sm mb-2">Accepted Currencies:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {invoiceData.acceptedCurrencies.map((currency) => (
                    <div key={currency.code} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                      <span className="text-slate-700">{currency.code}</span>
                      <span className="text-slate-900">{formatCurrency(convertCurrency(invoiceData.total, invoiceData.baseCurrency, currency.code, invoiceData.acceptedCurrencies), currency.code, invoiceData.acceptedCurrencies)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies - Only show if currencies are enabled and individual toggles are on */}
              {(invoiceData.showExchangeRatePolicy || invoiceData.showCurrencySpecificTerms) && (
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded space-y-3">
                  {invoiceData.showExchangeRatePolicy && (
                    <div>
                      <p className="mb-2"><strong>Exchange Rate Policy:</strong></p>
                      <p>{invoiceData.exchangeRatePolicy}</p>
                    </div>
                  )}
                  {invoiceData.showCurrencySpecificTerms && invoiceData.currencySpecificTerms && (
                    <div>
                      <p className="mb-2"><strong>International Payment Terms:</strong></p>
                      <p>{invoiceData.currencySpecificTerms}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Footer Section */}
      <div className="pt-12 sm:pt-16 space-y-6">
        {/* Logo */}
        <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/50 shadow-sm" style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px', maxWidth: '96px', maxHeight: '96px' }}>
          <img
            src={invoiceData.logoUrl || imgLogoImage}
            alt="Company Logo"
            className="w-full h-full object-contain p-1"
          />
        </div>

        {/* Company Details Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Company Details */}
          <div className="space-y-3">
            <h4 className="text-slate-900 text-base sm:text-lg">{invoiceData.companyName}</h4>
            <p className="text-slate-600 text-sm whitespace-pre-line">{invoiceData.companyAddress}</p>
            <a 
              href={`mailto:${invoiceData.companyEmail}`} 
              className="text-blue-600 text-sm hover:text-blue-700 block"
            >
              {invoiceData.companyEmail}
            </a>
            
            {/* Business ID 1 - Only show if both label and value are provided */}
            {invoiceData.businessId1Label && invoiceData.businessId1Value && (
              <div className="space-y-1">
                <p className="text-slate-500 text-sm">{invoiceData.businessId1Label}</p>
                <p className="text-slate-900 text-sm">{invoiceData.businessId1Value}</p>
              </div>
            )}
            
            {/* Business ID 2 - Only show if both label and value are provided */}
            {invoiceData.businessId2Label && invoiceData.businessId2Value && (
              <div className="space-y-1">
                <p className="text-slate-500 text-sm">{invoiceData.businessId2Label}</p>
                <p className="text-slate-900 text-sm">{invoiceData.businessId2Value}</p>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-3">
            <h4 className="text-slate-900 text-sm">Additional Notes</h4>
            <p className="text-slate-600 text-sm whitespace-pre-line">
              {invoiceData.notes || 'Thank you for your business!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);