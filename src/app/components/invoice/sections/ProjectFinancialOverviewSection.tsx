import React from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { Switch } from '../../ui/switch';
import { Plus, Trash2, FileText, Calculator, Info, List } from 'lucide-react';
import { InvoiceData, LineItem } from '../../../types/invoice';
import { formatCurrency } from '../../../utils/invoice';

interface ProjectFinancialOverviewSectionProps {
  invoiceData: InvoiceData;
  onInputChange: (field: keyof InvoiceData, value: string | number | boolean) => void;
}

export const ProjectFinancialOverviewSection: React.FC<ProjectFinancialOverviewSectionProps> = ({ invoiceData, onInputChange }) => {
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    onInputChange('lineItems', [...invoiceData.lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    onInputChange('lineItems', invoiceData.lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    const updatedItems = invoiceData.lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    onInputChange('lineItems', updatedItems);
  };

  return (
    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-slate-900">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Calculator className="w-5 h-5 text-indigo-600" />
            </div>
            Project & Financial Overview
          </CardTitle>
        </div>
        <p className="text-slate-500 text-sm mt-2">
          Manage all project-related information and financial details in one place.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Project Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-orange-600" />
              <Label className="text-slate-700">Project Information</Label>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="show-project-info" className="text-slate-700 text-sm">
                Show on Invoice
              </Label>
              <Switch
                id="show-project-info"
                checked={invoiceData.showProjectInfo}
                onCheckedChange={(checked) => onInputChange('showProjectInfo', checked)}
              />
            </div>
          </div>
          
          {!invoiceData.showProjectInfo && (
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-amber-700 text-sm">
                <Info className="w-4 h-4 inline mr-2" />
                Project information is hidden from the invoice. Enable the toggle above to show it in the Services section.
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-slate-700">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Website Redesign Project"
                value={invoiceData.projectName}
                onChange={(e) => onInputChange('projectName', e.target.value)}
                className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-slate-700">Project Description</Label>
              <Textarea
                id="projectDescription"
                placeholder="Brief description of the project scope and deliverables"
                value={invoiceData.projectDescription}
                onChange={(e) => onInputChange('projectDescription', e.target.value)}
                className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* Services & Items */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <List className="w-5 h-5 text-indigo-600" />
              <Label className="text-slate-700">Services & Items</Label>
            </div>
            <Button 
              onClick={addLineItem} 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-6">
            {invoiceData.lineItems.map((item, index) => (
              <div 
                key={item.id} 
                className="grid grid-cols-12 gap-4 items-end p-6 bg-slate-50/50 rounded-xl border border-slate-200/50 hover:bg-slate-50 transition-all duration-200"
              >
                <div className="col-span-5 space-y-2">
                  <Label className="text-slate-700">Description</Label>
                  <Input
                    placeholder="Design consultation, development work, etc."
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-slate-700">Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-slate-700">Rate</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-slate-700">Amount</Label>
                  <Input
                    value={formatCurrency(item.amount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}
                    disabled
                    className="bg-slate-100 border-slate-200 text-slate-800"
                  />
                </div>
                <div className="col-span-1">
                  {invoiceData.lineItems.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeLineItem(item.id)}
                      className="border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* Tax & Totals */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-green-600" />
            <Label className="text-slate-700">Tax & Totals</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="taxRate" className="text-slate-700">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                step="0.01"
                value={invoiceData.taxRate}
                onChange={(e) => onInputChange('taxRate', parseFloat(e.target.value) || 0)}
                className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">Tax Amount</Label>
              <Input 
                value={formatCurrency(invoiceData.taxAmount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)} 
                disabled 
                className="bg-slate-100 border-slate-200 text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-4 p-6 bg-slate-50/50 rounded-xl border border-slate-200/50">
            <div className="flex justify-between items-center text-slate-700">
              <span>Subtotal:</span>
              <span className="font-medium">{formatCurrency(invoiceData.subtotal, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span>Tax:</span>
              <span className="font-medium">{formatCurrency(invoiceData.taxAmount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</span>
            </div>
            <Separator className="bg-slate-200" />
            <div className="flex justify-between items-center text-lg">
              <span>Total:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(invoiceData.total, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};