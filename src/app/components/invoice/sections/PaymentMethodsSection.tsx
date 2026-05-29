import React from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { CreditCard, DollarSign, Globe, Percent, AlertCircle, Info, Save, Edit, Plus, Trash2 } from 'lucide-react';
import { InvoiceData, Currency, PaymentMethod } from '../../../types/invoice';
import { AVAILABLE_CURRENCIES, AVAILABLE_PAYMENT_METHODS } from '../../../constants/invoice';

interface PaymentMethodsSectionProps {
  invoiceData: InvoiceData;
  onInputChange: (field: keyof InvoiceData, value: string | number | boolean) => void;
}

export const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({ invoiceData, onInputChange }) => {
  const [isEditingInstructions, setIsEditingInstructions] = React.useState(false);
  const [tempInstructions, setTempInstructions] = React.useState(invoiceData.paymentInstructions);

  // Currency Management Functions
  const addCurrency = (currencyCode: string) => {
    const availableCurrency = AVAILABLE_CURRENCIES.find(c => c.code === currencyCode);
    if (!availableCurrency) return;

    const newCurrency: Currency = {
      ...availableCurrency,
      selected: true
    };

    onInputChange('acceptedCurrencies', [...invoiceData.acceptedCurrencies, newCurrency]);
  };

  const removeCurrency = (currencyCode: string) => {
    // Don't allow removing if it's the base currency
    if (currencyCode === invoiceData.baseCurrency) return;
    
    onInputChange('acceptedCurrencies', invoiceData.acceptedCurrencies.filter(c => c.code !== currencyCode));
  };

  const toggleCurrencySelection = (currencyCode: string) => {
    const updatedCurrencies = invoiceData.acceptedCurrencies.map(currency => 
      currency.code === currencyCode 
        ? { ...currency, selected: !currency.selected }
        : currency
    );
    onInputChange('acceptedCurrencies', updatedCurrencies);
  };

  const updateCurrency = (index: number, field: keyof Currency, value: string | number) => {
    const updatedCurrencies = invoiceData.acceptedCurrencies.map((currency, i) => 
      i === index ? { ...currency, [field]: value } : currency
    );
    onInputChange('acceptedCurrencies', updatedCurrencies);
  };

  // Payment Method Management Functions
  const addPaymentMethod = (methodName: string) => {
    const availableMethod = AVAILABLE_PAYMENT_METHODS.find(m => m.name === methodName);
    if (!availableMethod) return;

    const newMethod: PaymentMethod = {
      ...availableMethod,
      id: Date.now().toString(),
      enabled: true
    };

    onInputChange('paymentMethods', [...invoiceData.paymentMethods, newMethod]);
  };

  const removePaymentMethod = (methodId: string) => {
    onInputChange('paymentMethods', invoiceData.paymentMethods.filter(m => m.id !== methodId));
  };

  const updatePaymentMethod = (id: string, field: keyof PaymentMethod, value: string | number | boolean) => {
    const updatedMethods = invoiceData.paymentMethods.map(method => 
      method.id === id ? { ...method, [field]: value } : method
    );
    onInputChange('paymentMethods', updatedMethods);
  };

  // Get available currencies/methods not already added
  const getAvailableCurrencies = () => {
    const currentCodes = invoiceData.acceptedCurrencies.map(c => c.code);
    return AVAILABLE_CURRENCIES.filter(c => !currentCodes.includes(c.code));
  };

  const getAvailablePaymentMethods = () => {
    const currentMethods = invoiceData.paymentMethods.map(m => m.name);
    return AVAILABLE_PAYMENT_METHODS.filter(m => !currentMethods.includes(m.name));
  };

  return (
    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          Payment Methods & Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* General Payment Instructions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-slate-700 flex items-center gap-2">
              <Info className="w-4 h-4" />
              General Payment Instructions
            </Label>
            <div className="flex items-center gap-2">
              {isEditingInstructions ? (
                <Button
                  onClick={() => {
                    onInputChange('paymentInstructions', tempInstructions);
                    setIsEditingInstructions(false);
                  }}
                  size="sm"
                  variant="ghost"
                  className="p-2 hover:bg-green-100"
                >
                  <Save className="w-4 h-4 text-green-600" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setTempInstructions(invoiceData.paymentInstructions);
                    setIsEditingInstructions(true);
                  }}
                  size="sm"
                  variant="ghost"
                  className="p-2 hover:bg-blue-100"
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </Button>
              )}
            </div>
          </div>
          <Textarea
            placeholder="General payment terms, methods, and instructions for your client"
            value={isEditingInstructions ? tempInstructions : invoiceData.paymentInstructions}
            onChange={(e) => isEditingInstructions ? setTempInstructions(e.target.value) : onInputChange('paymentInstructions', e.target.value)}
            className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 min-h-[100px]"
            disabled={!isEditingInstructions}
          />
        </div>

        <Separator className="bg-slate-200" />

        {/* Base Currency */}
        <div className="space-y-2">
          <Label htmlFor="baseCurrency" className="text-slate-700">Base Currency</Label>
          <Select value={invoiceData.baseCurrency} onValueChange={(value) => onInputChange('baseCurrency', value)}>
            <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200">
              <SelectValue placeholder="Select base currency" />
            </SelectTrigger>
            <SelectContent>
              {invoiceData.acceptedCurrencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Accepted Currencies with Selection Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-slate-500" />
              <Label className="text-slate-700">Accepted Currencies</Label>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="show-currencies" className="text-slate-700 text-sm">
                Show on Invoice
              </Label>
              <Switch
                id="show-currencies"
                checked={invoiceData.showAcceptedCurrencies}
                onCheckedChange={(checked) => onInputChange('showAcceptedCurrencies', checked)}
              />
            </div>
          </div>
          
          {!invoiceData.showAcceptedCurrencies && (
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-amber-700 text-sm">
                <Info className="w-4 h-4 inline mr-2" />
                Currency information is hidden from the invoice. Enable the toggle above to show currency details, exchange rates, and policies.
              </p>
            </div>
          )}

          {/* Currency Selection and Configuration - Only show if toggle is ON */}
          {invoiceData.showAcceptedCurrencies && (
            <div className="space-y-6">
              {/* Add Currency Button */}
              <div className="flex justify-between items-center">
                <p className="text-slate-600 text-sm">Select which currencies you accept for payments</p>
                {getAvailableCurrencies().length > 0 && (
                  <Select onValueChange={addCurrency}>
                    <SelectTrigger className="w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 border-blue-600 hover:border-blue-700">
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-white" />
                        <span className="text-white">Add Currency</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableCurrencies().map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Currency List with Toggle Selection */}
              <div className="space-y-4">
                {invoiceData.acceptedCurrencies.map((currency, index) => (
                  <div key={currency.code} className="p-4 bg-slate-50/50 rounded-lg border border-slate-200/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                      <div className="space-y-2">
                        <Label className="text-slate-700">Currency</Label>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={currency.selected !== false}
                            onCheckedChange={() => toggleCurrencySelection(currency.code)}
                            disabled={currency.code === invoiceData.baseCurrency}
                          />
                          <Badge variant="outline">{currency.code}</Badge>
                          <span className="text-sm text-slate-600">{currency.name}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Exchange Rate</Label>
                        <Input
                          type="number"
                          step="0.0001"
                          value={currency.exchangeRate}
                          onChange={(e) => updateCurrency(index, 'exchangeRate', parseFloat(e.target.value) || 0)}
                          className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Service Fee</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={currency.serviceFee}
                          onChange={(e) => updateCurrency(index, 'serviceFee', parseFloat(e.target.value) || 0)}
                          className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Fee Type</Label>
                        <Select value={currency.serviceFeeType} onValueChange={(value) => updateCurrency(index, 'serviceFeeType', value)}>
                          <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Actions</Label>
                        {invoiceData.acceptedCurrencies.length > 1 && currency.code !== invoiceData.baseCurrency && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCurrency(currency.code)}
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
            </div>
          )}

          {/* Currency Policies - Only show if main toggle is ON */}
          {invoiceData.showAcceptedCurrencies && (
            <>
              <Separator className="bg-slate-200" />
              <div className="space-y-6">
                {/* Exchange Rate Policy - Optional Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="w-5 h-5 text-slate-500" />
                      <Label className="text-slate-700">Exchange Rate Policy</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor="show-exchange-policy" className="text-slate-700 text-sm">
                        Show on Invoice
                      </Label>
                      <Switch
                        id="show-exchange-policy"
                        checked={invoiceData.showExchangeRatePolicy}
                        onCheckedChange={(checked) => onInputChange('showExchangeRatePolicy', checked)}
                      />
                    </div>
                  </div>

                  {!invoiceData.showExchangeRatePolicy && (
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="text-amber-700 text-sm">
                        <Info className="w-4 h-4 inline mr-2" />
                        Exchange rate policy is hidden from the invoice. Enable the toggle above to show your exchange rate terms.
                      </p>
                    </div>
                  )}

                  {invoiceData.showExchangeRatePolicy && (
                    <Textarea
                      placeholder="Describe your exchange rate policy and update frequency"
                      value={invoiceData.exchangeRatePolicy}
                      onChange={(e) => onInputChange('exchangeRatePolicy', e.target.value)}
                      className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 min-h-[80px]"
                    />
                  )}
                </div>

                {/* Currency-Specific Terms - Optional Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-slate-500" />
                      <Label className="text-slate-700">Currency-Specific Terms</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor="show-currency-terms" className="text-slate-700 text-sm">
                        Show on Invoice
                      </Label>
                      <Switch
                        id="show-currency-terms"
                        checked={invoiceData.showCurrencySpecificTerms}
                        onCheckedChange={(checked) => onInputChange('showCurrencySpecificTerms', checked)}
                      />
                    </div>
                  </div>

                  {!invoiceData.showCurrencySpecificTerms && (
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="text-amber-700 text-sm">
                        <Info className="w-4 h-4 inline mr-2" />
                        Currency-specific terms are hidden from the invoice. Enable the toggle above to show international payment conditions.
                      </p>
                    </div>
                  )}

                  {invoiceData.showCurrencySpecificTerms && (
                    <Textarea
                      placeholder="Additional terms and conditions for international payments"
                      value={invoiceData.currencySpecificTerms}
                      onChange={(e) => onInputChange('currencySpecificTerms', e.target.value)}
                      className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 min-h-[80px]"
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <Separator className="bg-slate-200" />

        {/* Payment Methods with Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-500" />
              <Label className="text-slate-700">Payment Methods</Label>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="show-payment-methods" className="text-slate-700 text-sm">
                Show on Invoice
              </Label>
              <Switch
                id="show-payment-methods"
                checked={invoiceData.showPaymentMethods}
                onCheckedChange={(checked) => onInputChange('showPaymentMethods', checked)}
              />
            </div>
          </div>

          {!invoiceData.showPaymentMethods && (
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-amber-700 text-sm">
                <Info className="w-4 h-4 inline mr-2" />
                Payment methods are hidden from the invoice. Enable the toggle above to show payment options and processing details.
              </p>
            </div>
          )}

          {/* Payment Methods Section - Only show if toggle is ON */}
          {invoiceData.showPaymentMethods && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-slate-600 text-sm">Select which payment methods you accept</p>
                {getAvailablePaymentMethods().length > 0 && (
                  <Select onValueChange={addPaymentMethod}>
                    <SelectTrigger className="w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 border-blue-600 hover:border-blue-700">
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-white" />
                        <span className="text-white">Add Payment Method</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailablePaymentMethods().map((method) => (
                        <SelectItem key={method.id} value={method.name}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div className="space-y-3">
                {invoiceData.paymentMethods.map((method) => (
                  <div key={method.id} className="p-4 rounded-lg border border-slate-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={method.enabled}
                            onCheckedChange={(checked) => updatePaymentMethod(method.id, 'enabled', checked)}
                          />
                          <Label className="text-slate-700">{method.name}</Label>
                          {invoiceData.paymentMethods.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removePaymentMethod(method.id)}
                              className="ml-auto border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-700">Processing Fee</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={method.processingFee}
                              onChange={(e) => updatePaymentMethod(method.id, 'processingFee', parseFloat(e.target.value) || 0)}
                              className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700">Fee Type</Label>
                            <Select value={method.processingFeeType} onValueChange={(value) => updatePaymentMethod(method.id, 'processingFeeType', value)}>
                              <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                <SelectItem value="percentage">Percentage</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Specific Instructions & Terms</Label>
                        <Textarea
                          placeholder="Specific instructions and terms for this payment method"
                          value={method.terms}
                          onChange={(e) => updatePaymentMethod(method.id, 'terms', e.target.value)}
                          className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};