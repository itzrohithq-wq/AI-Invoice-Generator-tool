import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { CalendarDays } from 'lucide-react';
import { InvoiceData } from '../../../types/invoice';

interface InvoiceDetailsSectionProps {
  invoiceData: InvoiceData;
  onInputChange: (field: keyof InvoiceData, value: string | number | boolean) => void;
}

export const InvoiceDetailsSection: React.FC<InvoiceDetailsSectionProps> = ({ invoiceData, onInputChange }) => (
  <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm">
    <CardHeader className="pb-6">
      <CardTitle className="flex items-center gap-3 text-slate-900">
        <div className="p-2 bg-blue-50 rounded-lg">
          <CalendarDays className="w-5 h-5 text-blue-600" />
        </div>
        Invoice Details
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber" className="text-slate-700">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={(e) => onInputChange('invoiceNumber', e.target.value)}
            className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date" className="text-slate-700">Issue Date</Label>
          <Input
            id="date"
            type="date"
            value={invoiceData.date}
            onChange={(e) => onInputChange('date', e.target.value)}
            className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate" className="text-slate-700">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={invoiceData.dueDate}
          onChange={(e) => onInputChange('dueDate', e.target.value)}
          className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
        />
      </div>
    </CardContent>
  </Card>
);