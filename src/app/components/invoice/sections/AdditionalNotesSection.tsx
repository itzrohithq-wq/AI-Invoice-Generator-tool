import React from 'react';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { StickyNote } from 'lucide-react';
import { InvoiceData } from '../../../types/invoice';

interface AdditionalNotesSectionProps {
  invoiceData: InvoiceData;
  onInputChange: (field: keyof InvoiceData, value: string | number | boolean) => void;
}

export const AdditionalNotesSection: React.FC<AdditionalNotesSectionProps> = ({ invoiceData, onInputChange }) => (
  <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm">
    <CardHeader className="pb-6">
      <CardTitle className="flex items-center gap-3 text-slate-900">
        <div className="p-2 bg-yellow-50 rounded-lg">
          <StickyNote className="w-5 h-5 text-yellow-600" />
        </div>
        Additional Notes
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Textarea
          placeholder="Any additional notes, terms, or information for your client"
          value={invoiceData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
        />
      </div>
    </CardContent>
  </Card>
);