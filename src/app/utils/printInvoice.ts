import { InvoiceData } from '../types/invoice';
import { formatDate, formatCurrency } from './invoice';
import imgLogoImage from "figma:asset/9f2b02a70d969501a98e759282b75e264fcf1f41.png";

export const printInvoice = (invoiceData: InvoiceData) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print/download the invoice.');
    return;
  }

  const logoSrc = invoiceData.logoUrl || imgLogoImage;

  // Format line items
  const lineItemsHTML = invoiceData.lineItems.map((item, index) => `
    <tr class="border-b border-slate-100">
      <td class="py-4 text-sm text-slate-900 pr-4">${item.description || `Service Item ${index + 1}`}</td>
      <td class="py-4 text-sm text-slate-600 text-right tabular-nums">${item.quantity}</td>
      <td class="py-4 text-sm text-slate-600 text-right tabular-nums">${formatCurrency(item.rate, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</td>
      <td class="py-4 text-sm font-medium text-slate-900 text-right tabular-nums">${formatCurrency(item.amount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</td>
    </tr>
  `).join('');

  // Format payment schedule if any
  const scheduleHTML = invoiceData.paymentScheduleType === 'installments' ? `
    <div class="mt-8 pt-8 border-t border-slate-100">
      <h3 class="text-sm font-semibold text-slate-900 mb-3">Payment Schedule</h3>
      <div class="space-y-2">
        ${invoiceData.paymentSchedule.map(payment => `
          <div class="flex justify-between items-center bg-slate-50 p-3 rounded-lg text-sm">
            <div>
              <p class="font-medium text-slate-900">${payment.description}</p>
              <p class="text-xs text-slate-500">Due: ${formatDate(payment.dueDate)}</p>
            </div>
            <div class="text-right">
              <p class="font-medium text-slate-900">${formatCurrency(payment.amount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</p>
              <p class="text-xs text-slate-500">${payment.percentage}%</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Format currencies if shown
  const currenciesHTML = invoiceData.showAcceptedCurrencies ? `
    <div class="mt-6">
      <p class="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Accepted Currencies:</p>
      <div class="grid grid-cols-2 gap-2 text-sm">
        ${invoiceData.acceptedCurrencies.map(c => {
          const baseRate = invoiceData.acceptedCurrencies.find(curr => curr.code === invoiceData.baseCurrency)?.exchangeRate || 1;
          const converted = (invoiceData.total / baseRate) * c.exchangeRate;
          return `
            <div class="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span class="text-slate-700 font-medium">${c.code}</span>
              <span class="text-slate-900">${formatCurrency(converted, c.code, invoiceData.acceptedCurrencies)}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  // Format payment methods if shown
  const paymentMethodsHTML = invoiceData.showPaymentMethods ? `
    <div class="mt-6">
      <p class="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Accepted Payment Methods:</p>
      <div class="space-y-2 text-sm">
        ${invoiceData.paymentMethods.filter(m => m.enabled).map(m => `
          <div class="py-2 border-b border-slate-100 flex justify-between items-start">
            <div class="flex-1 pr-4">
              <p class="font-medium text-slate-900">${m.name}</p>
              <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">${m.terms}</p>
            </div>
            ${m.processingFee > 0 ? `
              <span class="text-xs border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-medium whitespace-nowrap ml-3">
                +${m.processingFee}${m.processingFeeType === 'percentage' ? '%' : ' fee'}
              </span>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Format project info if shown
  const projectHTML = invoiceData.showProjectInfo ? `
    <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 mb-6">
      <h3 class="text-sm font-semibold text-blue-900 mb-1">${invoiceData.projectName || 'Project Details'}</h3>
      <p class="text-xs text-blue-700/80 leading-relaxed">${invoiceData.projectDescription || ''}</p>
    </div>
  ` : '';

  // Format company IDs
  const id1HTML = invoiceData.businessId1Label && invoiceData.businessId1Value ? `
    <div class="text-xs text-slate-500 mt-2">${invoiceData.businessId1Label}: <span class="text-slate-950 font-medium">${invoiceData.businessId1Value}</span></div>
  ` : '';
  const id2HTML = invoiceData.businessId2Label && invoiceData.businessId2Value ? `
    <div class="text-xs text-slate-500 mt-1">${invoiceData.businessId2Label}: <span class="text-slate-950 font-medium">${invoiceData.businessId2Value}</span></div>
  ` : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice #${invoiceData.invoiceNumber}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @media print {
            body {
              background-color: white;
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body class="bg-white p-6 sm:p-8 max-w-[800px] mx-auto text-slate-800">
        <!-- Floating print trigger for preview window -->
        <div class="no-print mb-6 flex justify-end">
          <button onclick="window.print();" class="bg-[#635bff] hover:bg-[#5249eb] text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer">
            Print / Save as PDF
          </button>
        </div>

        <div class="relative bg-slate-50/70 rounded-3xl p-6 sm:p-8 mb-8 border border-slate-100 overflow-hidden">
          <!-- Logo background color accent -->
          <div class="absolute bg-slate-100/50 h-full w-2 left-0 top-0"></div>
          
          <div class="grid grid-cols-2 gap-4 items-start">
            <div>
              <h1 class="text-3xl font-bold text-slate-900 tracking-tight mb-4">INVOICE</h1>
              <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Billed To</p>
              <h3 class="text-sm font-semibold text-slate-900">${invoiceData.clientName || 'Client Name'}</h3>
              <p class="text-xs text-slate-600 whitespace-pre-line mt-1">${invoiceData.clientAddress || 'Client Address'}</p>
            </div>
            <div class="text-right space-y-3">
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider">Invoice Number</p>
                <p class="text-sm font-bold text-slate-900">#${invoiceData.invoiceNumber}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider">Issue Date</p>
                <p class="text-sm text-slate-900">${formatDate(invoiceData.date)}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider">Due Date</p>
                <p class="text-sm text-slate-900">${formatDate(invoiceData.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>

        ${projectHTML}

        <div class="mb-8">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-slate-200 text-left">
                <th class="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Item</th>
                <th class="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Qty</th>
                <th class="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Rate</th>
                <th class="py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHTML}
            </tbody>
          </table>
        </div>

        <div class="grid grid-cols-2 gap-8 items-start mb-8">
          <div>
            <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Payment Terms</h4>
            <p class="text-xs text-slate-600 leading-relaxed">${invoiceData.paymentInstructions || ''}</p>
            ${currenciesHTML}
            ${paymentMethodsHTML}
          </div>
          <div class="flex flex-col items-end">
            <div class="bg-slate-50 rounded-2xl p-5 w-full max-w-[300px] space-y-2.5 border border-slate-100">
              <div class="flex justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span class="tabular-nums">${formatCurrency(invoiceData.subtotal, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</span>
              </div>
              <div class="flex justify-between text-xs text-slate-600">
                <span>Tax (${invoiceData.taxRate}%)</span>
                <span class="tabular-nums">${formatCurrency(invoiceData.taxAmount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</span>
              </div>
              <div class="border-t border-slate-200 my-2"></div>
              <div class="flex justify-between text-sm font-bold text-slate-900">
                <span>Total (${invoiceData.baseCurrency})</span>
                <span class="tabular-nums text-lg font-bold">${formatCurrency(invoiceData.total, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</span>
              </div>
            </div>
          </div>
        </div>

        ${scheduleHTML}

        <div class="mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8">
          <div>
            <div class="flex flex-col gap-3 mb-2">
              <div style="width: 96px; height: 96px; overflow: hidden; display: flex; align-items: center; justify-content: center; background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px;">
                <img src="${logoSrc}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="Logo" />
              </div>
              <h4 class="text-sm font-bold text-slate-900">${invoiceData.companyName || 'Company Name'}</h4>
            </div>
            <p class="text-xs text-slate-600 whitespace-pre-line mt-1">${invoiceData.companyAddress || 'Company Address'}</p>
            <p class="text-xs text-blue-600 mt-1">${invoiceData.companyEmail || ''}</p>
            ${id1HTML}
            ${id2HTML}
          </div>
          <div>
            <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Additional Notes</h4>
            <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">${invoiceData.notes || 'Thank you for your business!'}</p>
          </div>
        </div>

        <script>
          // Auto trigger printing after content loads
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 600);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
