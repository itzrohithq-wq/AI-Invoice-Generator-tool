import React from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Badge } from '../../ui/badge';
import { Plus, Trash2, Clock } from 'lucide-react';
import { InvoiceData, PaymentSchedule } from '../../../types/invoice';
import { getTotalPercentage, formatCurrency } from '../../../utils/invoice';

interface PaymentScheduleSectionProps {
  invoiceData: InvoiceData;
  onInputChange: (field: keyof InvoiceData, value: string | number | boolean) => void;
}

export const PaymentScheduleSection: React.FC<PaymentScheduleSectionProps> = ({ invoiceData, onInputChange }) => {
  const addPaymentSchedule = () => {
    const newPayment: PaymentSchedule = {
      id: Date.now().toString(),
      percentage: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: 0,
      description: `Payment ${invoiceData.paymentSchedule.length + 1}`
    };
    onInputChange('paymentSchedule', [...invoiceData.paymentSchedule, newPayment]);
  };

  const removePaymentSchedule = (id: string) => {
    onInputChange('paymentSchedule', invoiceData.paymentSchedule.filter(payment => payment.id !== id));
  };

  const updatePaymentSchedule = (id: string, field: keyof PaymentSchedule, value: string | number) => {
    const updatedSchedule = invoiceData.paymentSchedule.map(payment => 
      payment.id === id ? { ...payment, [field]: value } : payment
    );
    onInputChange('paymentSchedule', updatedSchedule);
  };

  return (
    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          Payment Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Type Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-slate-200/50">
          <div className="space-y-1">
            <Label className="text-slate-700">Payment Type</Label>
            <p className="text-sm text-slate-500">Choose between one-time payment or installment payments</p>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="payment-type" className="text-slate-700">
              {invoiceData.paymentScheduleType === 'one-time' ? 'One-time Payment' : 'Installment Payments'}
            </Label>
            <Switch
              id="payment-type"
              checked={invoiceData.paymentScheduleType === 'installments'}
              onCheckedChange={(checked) => 
                onInputChange('paymentScheduleType', checked ? 'installments' : 'one-time')
              }
            />
          </div>
        </div>

        {/* Installment Configuration */}
        {invoiceData.paymentScheduleType === 'installments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-700">Payment Installments</Label>
                <p className="text-sm text-slate-500">Configure payment schedule with percentages and due dates</p>
              </div>
              <Button 
                onClick={addPaymentSchedule} 
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Payment
              </Button>
            </div>

            {/* Payment Schedule Items */}
            <div className="space-y-4">
              {invoiceData.paymentSchedule.map((payment, index) => (
                <div 
                  key={payment.id} 
                  className="p-4 bg-slate-50/50 rounded-lg border border-slate-200/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label className="text-slate-700">Description</Label>
                      <Input
                        placeholder="Payment description"
                        value={payment.description}
                        onChange={(e) => updatePaymentSchedule(payment.id, 'description', e.target.value)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Percentage (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={payment.percentage}
                        onChange={(e) => updatePaymentSchedule(payment.id, 'percentage', parseFloat(e.target.value) || 0)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700">Due Date</Label>
                      <Input
                        type="date"
                        value={payment.dueDate}
                        onChange={(e) => updatePaymentSchedule(payment.id, 'dueDate', e.target.value)}
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1 space-y-2">
                        <Label className="text-slate-700">Amount</Label>
                        <Input
                          value={formatCurrency(payment.amount, invoiceData.baseCurrency, invoiceData.acceptedCurrencies)}
                          disabled
                          className="bg-slate-100 border-slate-200 text-slate-800"
                        />
                      </div>
                      {invoiceData.paymentSchedule.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePaymentSchedule(payment.id)}
                          className="border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Schedule Summary */}
            <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-200/50">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Total Percentage:</span>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${getTotalPercentage(invoiceData.paymentSchedule) === 100 ? 'text-green-600' : getTotalPercentage(invoiceData.paymentSchedule) > 100 ? 'text-red-600' : 'text-orange-600'}`}>
                    {getTotalPercentage(invoiceData.paymentSchedule).toFixed(1)}%
                  </span>
                  {getTotalPercentage(invoiceData.paymentSchedule) !== 100 && (
                    <Badge variant={getTotalPercentage(invoiceData.paymentSchedule) > 100 ? 'destructive' : 'secondary'} className="text-xs">
                      {getTotalPercentage(invoiceData.paymentSchedule) > 100 ? 'Over 100%' : 'Under 100%'}
                    </Badge>
                  )}
                </div>
              </div>
              {getTotalPercentage(invoiceData.paymentSchedule) !== 100 && (
                <p className="text-sm text-slate-500 mt-2">
                  {getTotalPercentage(invoiceData.paymentSchedule) > 100 
                    ? 'Payment percentages exceed 100%. Please adjust the values.' 
                    : 'Payment percentages should total 100% for complete payment.'
                  }
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};