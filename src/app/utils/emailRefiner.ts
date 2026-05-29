import { InvoiceData } from '../types/invoice';
import { formatCurrency } from './invoice';

export const EMAIL_TONES = [
  { id: 'professional', label: '👔 Professional' },
  { id: 'friendly', label: '😊 Friendly' },
  { id: 'reminder', label: '⏰ Gentle Reminder' },
  { id: 'formal', label: '💼 Formal Business' },
  { id: 'short', label: '⚡ Short & Crisp' },
  { id: 'agency', label: '✨ Premium Agency' }
];

export const refineEmailContent = (
  tone: string,
  invoiceData: InvoiceData,
  formatDate: (date: string) => string
): string => {
  const client = invoiceData.clientName || 'Client';
  const company = invoiceData.companyName || 'Company';
  const invNo = invoiceData.invoiceNumber || 'N/A';
  const project = invoiceData.projectName || 'Project';
  const amount = formatCurrency(invoiceData.total, invoiceData.baseCurrency, invoiceData.acceptedCurrencies);
  const dueDate = formatDate(invoiceData.dueDate);
  const date = formatDate(invoiceData.date);
  const email = invoiceData.companyEmail || '';
  const instructions = invoiceData.paymentInstructions || '';

  // Handle installments formatting if applicable
  let scheduleDetails = '';
  if (invoiceData.paymentScheduleType === 'installments' && invoiceData.paymentSchedule.length > 0) {
    scheduleDetails = `\n💫 Installment Breakdown:\n` + invoiceData.paymentSchedule.map((p, i) => 
      `   ${i + 1}. ${p.description}: ${formatCurrency(p.amount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)} (${p.percentage}% of total) - Due: ${formatDate(p.dueDate)}`
    ).join('\n') + `\n`;
  }

  switch (tone) {
    case 'friendly':
      return `Hi ${client} team! 👋

Hope you're having a wonderful week! It has been an absolute blast collaborating on the "${project}" project. We're super proud of what we've built together! 😊

To keep everything on track, here's a quick summary of the invoice:
• Invoice Number: #${invNo}
• Total Investment: ${amount}
• Due Date: ${dueDate}
${scheduleDetails}
Payment details:
${instructions}

If you have any questions or just want to chat about the invoice, please feel free to drop a line.

Warmest wishes,
${company} 💝
${email}`;

    case 'reminder':
      return `Dear ${client} Team,

This is a gentle update regarding invoice #${invNo} for the "${project}" project. We hope everything is going great on your end!

Summary details:
• Invoice: #${invNo}
• Amount: ${amount}
• Payment Due: ${dueDate}
${scheduleDetails}
Please review the payment steps:
${instructions}

Thank you so much for your prompt attention to this. If payment is already in progress, please disregard this reminder.

Best regards,
${company}
${email}`;

    case 'formal':
      return `Dear ${client},

Please accept this message as formal submittal of Invoice #${invNo} for professional services rendered in relation to the "${project}" project.

Invoice Details:
• Reference ID: #${invNo}
• Balance Due: ${amount}
• Date of Issue: ${date}
• Payment Due Date: ${dueDate}
${scheduleDetails}
Payment is requested via the following instructions:
${instructions}

For any inquiries or administrative clarifications, please contact us at ${email}.

Sincerely,
${company}`;

    case 'short':
      return `Hello ${client},

Please find attached Invoice #${invNo} for the "${project}" project.

• Invoice: #${invNo}
• Total Due: ${amount}
• Due Date: ${dueDate}
${scheduleDetails}
Instructions:
${instructions}

Thanks,
${company} (${email})`;

    case 'agency':
      return `Dear ${client} Team,

It has been an absolute privilege working with you to elevate your brand and digital presence through the "${project}" project. Our team has thoroughly enjoyed bringing this vision to life.

As we conclude this phase of work, please find the invoice details below:
• Invoice Identification: #${invNo}
• Professional Investment: ${amount}
• Scheduled Settlement Date: ${dueDate}
${scheduleDetails}
Payment details:
${instructions}

We look forward to partnering on future high-impact projects.

Warm regards,
${company}
${email}`;

    case 'professional':
    default:
      return `Dear ${client} Team,

We hope you are doing well. Please find the completed invoice for the "${project}" project.

• Invoice Number: #${invNo}
• Amount Due: ${amount}
• Due Date: ${dueDate}
${scheduleDetails}
Please follow the payment instructions below to process the invoice:
${instructions}

If you have any questions or require additional details regarding this invoice, please do not hesitate to reach out.

Best regards,
${company}
${email}`;
  }
};
