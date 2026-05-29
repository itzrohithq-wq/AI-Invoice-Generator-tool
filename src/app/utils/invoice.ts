import { InvoiceData, EmailData, Currency } from '../types/invoice';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatCurrency = (amount: number, currencyCode: string, currencies: Currency[]) => {
  if (currencyCode === 'INR') {
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    return `₹${formatted}`;
  }
  const currency = currencies.find(c => c.code === currencyCode);
  const symbol = currency?.symbol || '$';
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${symbol}${formatted}`;
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string, currencies: Currency[]) => {
  const fromRate = currencies.find(c => c.code === fromCurrency)?.exchangeRate || 1;
  const toRate = currencies.find(c => c.code === toCurrency)?.exchangeRate || 1;
  return (amount / fromRate) * toRate;
};

export const getTotalPercentage = (paymentSchedule: any[]) => {
  return paymentSchedule.reduce((sum, payment) => sum + payment.percentage, 0);
};

export const generateEmailSubject = (invoiceData: InvoiceData) => {
  return `✨ Your ${invoiceData.showProjectInfo ? invoiceData.projectName : 'project'} invoice is ready!`;
};

export const generateEmailBody = (invoiceData: InvoiceData, formatDate: (date: string) => string) => {
  return `Hello ${invoiceData.clientName} team! 👋

I hope you're having a wonderful day and that everything is going smoothly on your end.

${invoiceData.showProjectInfo ? `It's been such a pleasure working with you on the ${invoiceData.projectName} project! 🌟 From our initial conversations to seeing the final results come to life, this journey has been truly rewarding. I'm genuinely excited about what we've accomplished together and hope you're as thrilled with the outcome as I am.` : `It's been such a pleasure working with you! 🌟 From our initial conversations to seeing the final results come to life, this journey has been truly rewarding. I'm genuinely excited about what we've accomplished together and hope you're as thrilled with the outcome as I am.`}

Now that we've wrapped up this exciting chapter, I wanted to share the invoice details with you in a warm and transparent way:

📋 ${invoiceData.showProjectInfo ? 'Project Summary' : 'Invoice Summary'}:
   • Invoice Number: ${invoiceData.invoiceNumber}${invoiceData.showProjectInfo ? `
   • Project: ${invoiceData.projectName}` : ''}
   • Investment Total: ${formatCurrency(invoiceData.total, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}
   • Gentle Reminder Date: ${formatDate(invoiceData.dueDate)}

${invoiceData.paymentScheduleType === 'installments' ? `💫 To make things as comfortable as possible for you, I've structured the payment in convenient installments:

${invoiceData.paymentSchedule.map((payment, index) => 
  `   ${index + 1}. ${payment.description}: ${formatCurrency(payment.amount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)} (${payment.percentage}% of total) 
      Kindly due by: ${formatDate(payment.dueDate)} 🗓️`
).join('\n\n')}

This approach allows you to manage your cash flow while I can continue delivering exceptional work for amazing clients like you! ✨

` : ''}🤝 Making Payment Simple & Stress-Free:
I've tried to make the payment process as smooth as possible for you. Here's everything you need to know:

${invoiceData.paymentInstructions}

I know that financial details can sometimes feel overwhelming, so please know that I'm here to support you through every step. If any part of this doesn't work perfectly for your team's process, just let me know and we can explore alternatives together.

💬 Your Comfort Is My Priority:
If you have any questions, concerns, or if there's anything about this invoice that doesn't feel quite right, please don't hesitate to reach out. I'm always here for a friendly chat and want to make sure everything feels comfortable and clear for you.

I truly value our partnership and the trust you've placed in me. Working with thoughtful people like yourselves is what makes this work so fulfilling! 🙏

Looking forward to the possibility of creating more amazing things together in the future. Until then, I hope your week is filled with wonderful moments and exciting opportunities!

With gratitude and warm regards,
${invoiceData.companyName} 💝
${invoiceData.companyEmail}

P.S. I'd love to hear how the project is being received by your team and users. Feel free to share any feedback or success stories - they always brighten my day! 🌈`;
};

export const createEmailUrl = (
  provider: 'gmail' | 'outlook' | 'yahoo' | 'default',
  emailData: EmailData
) => {
  const { to, cc, bcc, subject, body } = emailData;
  
  switch (provider) {
    case 'gmail':
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${cc ? `&cc=${encodeURIComponent(cc)}` : ''}${bcc ? `&bcc=${encodeURIComponent(bcc)}` : ''}`;
    
    case 'outlook':
      return `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${cc ? `&cc=${encodeURIComponent(cc)}` : ''}${bcc ? `&bcc=${encodeURIComponent(bcc)}` : ''}`;
    
    case 'yahoo':
      return `https://compose.mail.yahoo.com/?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    case 'default':
      return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${cc ? `&cc=${cc}` : ''}${bcc ? `&bcc=${bcc}` : ''}`;
    
    default:
      return '';
  }
};