import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Send, ArrowLeft, Info, Paperclip, Type, AtSign, ExternalLink, Mail, Edit3, FileText, StickyNote, Save, Check, Sparkles } from 'lucide-react';
import { EmailData, InvoiceData } from '../../types/invoice';
import { formatDate } from '../../utils/invoice';
import { EMAIL_TONES, refineEmailContent } from '../../utils/emailRefiner';

interface EmailComponentsProps {
  emailData: EmailData;
  invoiceData: InvoiceData;
  onEmailInputChange: (field: keyof EmailData, value: string | boolean) => void;
  onBackToInvoice: () => void;
  onBackToComposer: () => void;
  onShowSendOptions: () => void;
  onSendViaGmail: () => void;
  onSendViaOutlook: () => void;
  onSendViaYahoo: () => void;
  onSendViaDefault: () => void;
}

export const SendOptions: React.FC<EmailComponentsProps> = ({
  emailData,
  onBackToComposer,
  onBackToInvoice,
  onSendViaGmail,
  onSendViaOutlook,
  onSendViaYahoo,
  onSendViaDefault,
}) => (
  <div className="space-y-8">
    {/* Send Options Header */}
    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-slate-900">
            <div className="p-2 bg-green-50 rounded-lg">
              <Send className="w-5 h-5 text-green-600" />
            </div>
            Choose Email Client
          </CardTitle>
          <Button
            onClick={onBackToComposer}
            variant="outline"
            size="sm"
            className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-slate-700 text-sm">
            <Info className="w-4 h-4 inline mr-2" />
            Your email is ready! Choose how you'd like to send it. We'll open your preferred email client with the message pre-filled.
          </p>
        </div>

        {/* Email Preview Summary */}
        <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
          <h4 className="text-slate-900 text-sm">Email Summary:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">To:</span>
              <span className="text-slate-700">{emailData.to}</span>
            </div>
            {emailData.cc && (
              <div className="flex justify-between">
                <span className="text-slate-500">CC:</span>
                <span className="text-slate-700">{emailData.cc}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Subject:</span>
              <span className="text-slate-700 truncate max-w-[200px]">{emailData.subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Attachment:</span>
              <span className="text-slate-700">{emailData.attachInvoice ? 'Invoice PDF included' : 'No attachment'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Email Client Options */}
    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-purple-50 rounded-lg">
            <ExternalLink className="w-5 h-5 text-purple-600" />
          </div>
          Select Email Client
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gmail Option */}
        <Button
          onClick={onSendViaGmail}
          variant="outline"
          className="w-full justify-start p-6 h-auto border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <Mail className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-left">
              <div className="font-medium">Gmail</div>
              <div className="text-sm text-slate-500">Open in Gmail web interface</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 ml-auto" />
        </Button>

        {/* Outlook Option */}
        <Button
          onClick={onSendViaOutlook}
          variant="outline"
          className="w-full justify-start p-6 h-auto border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-medium">Outlook</div>
              <div className="text-sm text-slate-500">Open in Outlook web interface</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 ml-auto" />
        </Button>

        {/* Yahoo Option */}
        <Button
          onClick={onSendViaYahoo}
          variant="outline"
          className="w-full justify-start p-6 h-auto border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-medium">Yahoo Mail</div>
              <div className="text-sm text-slate-500">Open in Yahoo Mail web interface</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 ml-auto" />
        </Button>

        {/* Default Email Client Option */}
        <Button
          onClick={onSendViaDefault}
          variant="outline"
          className="w-full justify-start p-6 h-auto border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Mail className="w-6 h-6 text-slate-600" />
            </div>
            <div className="text-left">
              <div className="font-medium">Default Email App</div>
              <div className="text-sm text-slate-500">Open in your computer's default email application</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 ml-auto" />
        </Button>
      </CardContent>
    </Card>

    {/* Cancel/Back Options */}
    <div className="flex justify-center gap-4">
      <Button 
        onClick={onBackToInvoice}
        variant="outline"
        className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 px-8 py-3 h-auto"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Cancel & Return to Invoice
      </Button>
    </div>
  </div>
);

export const EmailComposer: React.FC<EmailComponentsProps> = ({
  emailData,
  invoiceData,
  onEmailInputChange,
  onBackToInvoice,
  onShowSendOptions,
}) => {
  const [selectedTone, setSelectedTone] = React.useState('professional');

  const handleRefine = () => {
    const refined = refineEmailContent(selectedTone, invoiceData, formatDate);
    onEmailInputChange('body', refined);
  };

  return (
    <div className="space-y-8">
    {/* Email Composer Header */}
    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-slate-900">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Edit3 className="w-5 h-5 text-blue-600" />
            </div>
            Draft Email
          </CardTitle>
          <Button
            onClick={onBackToInvoice}
            variant="outline"
            size="sm"
            className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoice
          </Button>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-700 text-sm">
            <Info className="w-4 h-4 inline mr-2" />
            Review and customize your email before sending. All fields are pre-populated with invoice details.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Recipients */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="emailTo" className="text-slate-700 flex items-center gap-2">
              <AtSign className="w-4 h-4" />
              To (Required)
            </Label>
            <Input
              id="emailTo"
              type="email"
              placeholder="client@company.com"
              value={emailData.to}
              onChange={(e) => onEmailInputChange('to', e.target.value)}
              className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emailCc" className="text-slate-700">CC (Optional)</Label>
              <Input
                id="emailCc"
                type="email"
                placeholder="manager@company.com"
                value={emailData.cc}
                onChange={(e) => onEmailInputChange('cc', e.target.value)}
                className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailBcc" className="text-slate-700">BCC (Optional)</Label>
              <Input
                id="emailBcc"
                type="email"
                placeholder="admin@yourcompany.com"
                value={emailData.bcc}
                onChange={(e) => onEmailInputChange('bcc', e.target.value)}
                className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Email Content & Options */}
    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          Email Content & Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Email Subject */}
        <div className="space-y-2">
          <Label htmlFor="emailSubject" className="text-slate-700 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Subject Line
          </Label>
          <Input
            id="emailSubject"
            placeholder="Subject line for your email"
            value={emailData.subject}
            onChange={(e) => onEmailInputChange('subject', e.target.value)}
            className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
          />
        </div>

        <Separator className="bg-slate-200" />

        {/* Email Message */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="emailBody" className="text-slate-700 font-medium">Email Message</Label>
            <div className="flex items-center gap-2">
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger className="w-[180px] bg-white border-slate-200 h-8 text-xs">
                  <SelectValue placeholder="Select Tone" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200">
                  {EMAIL_TONES.map((tone) => (
                    <SelectItem key={tone.id} value={tone.id} className="text-xs">
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleRefine}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm h-8 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Refine
              </Button>
            </div>
          </div>
          <div className="relative">
            <Textarea
              id="emailBody"
              placeholder="Compose your email message here..."
              value={emailData.body}
              onChange={(e) => onEmailInputChange('body', e.target.value)}
              className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 min-h-[300px] text-sm leading-relaxed"
            />
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            💡 Choose a tone style from the dropdown and click <strong>Refine</strong> to instantly rewrite your message into a premium template. Your factual invoice values will remain 100% correct.
          </p>
        </div>

        <Separator className="bg-slate-200" />

        {/* Email Options */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-slate-500" />
            <Label className="text-slate-700">Email Options</Label>
          </div>
          
          <div className="space-y-6">
            {/* Attachment Option */}
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-slate-200/50">
              <div className="flex items-center gap-3">
                <Paperclip className="w-5 h-5 text-slate-500" />
                <div>
                  <Label className="text-slate-700">Attach Invoice PDF</Label>
                  <p className="text-sm text-slate-500">Include the invoice as a PDF attachment</p>
                </div>
              </div>
              <Checkbox
                checked={emailData.attachInvoice}
                onCheckedChange={(checked) => onEmailInputChange('attachInvoice', checked)}
              />
            </div>
            
            {/* Priority Setting */}
            <div className="space-y-2">
              <Label className="text-slate-700">Email Priority</Label>
              <Select value={emailData.priority} onValueChange={(value) => onEmailInputChange('priority', value)}>
                <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Send Email Button */}
    <div className="flex justify-center gap-4">
      <Button 
        onClick={onShowSendOptions}
        disabled={!emailData.to || !emailData.subject}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white shadow-sm hover:shadow-md transition-all duration-200 px-8 py-3 h-auto"
      >
        <Send className="w-5 h-5 mr-2" />
        Continue to Send
      </Button>
      <Button 
        onClick={onBackToInvoice}
        variant="outline"
        className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 px-8 py-3 h-auto"
      >
        <Save className="w-5 h-5 mr-2" />
        Save Draft
      </Button>
    </div>
  </div>
);
};

export const EmailPreviewContent: React.FC<{ invoiceData: InvoiceData; emailData: EmailData }> = ({ invoiceData, emailData }) => {
  return (
    <div className="bg-white relative rounded-2xl w-full min-h-[600px] overflow-hidden shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Email Preview</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Draft</Badge>
          </div>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">To:</span>
            <span className="text-slate-700">{emailData.to || invoiceData.clientEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">From:</span>
            <span className="text-slate-700">{invoiceData.companyEmail}</span>
          </div>
          {emailData.cc && (
            <div className="flex justify-between">
              <span className="text-slate-500">CC:</span>
              <span className="text-slate-700">{emailData.cc}</span>
            </div>
          )}
          {emailData.bcc && (
            <div className="flex justify-between">
              <span className="text-slate-500">BCC:</span>
              <span className="text-slate-700">{emailData.bcc}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Subject:</span>
            <span className="text-slate-700 font-medium">{emailData.subject || `✨ Your invoice is ready!`}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed font-sans">
          {emailData.body || 'Email message is empty. Type a message in the composer to preview it.'}
        </div>
      </div>
    </div>
  );
};