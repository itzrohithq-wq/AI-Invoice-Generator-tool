import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../../ui/dialog';
import { Building2, User, Upload, FileImage, Scan, Edit, Check, Save, Plus, Trash2, Star, StarOff, Search, BookOpen, X } from 'lucide-react';
import { InvoiceData, BusinessInfoTab, InputMode, SavedContact } from '../../../types/invoice';
import { saveContact, updateContact, deleteContact, loadContacts, getDefaultCompany, searchContacts, contactNameExists } from '../../../utils/contacts';

interface BusinessInformationSectionProps {
  invoiceData: InvoiceData;
  businessInfoTab: BusinessInfoTab;
  inputMode: InputMode;
  isExtracting: boolean;
  extractedData: any;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (field: keyof InvoiceData, value: string | number | boolean) => void;
  setBusinessInfoTab: (tab: BusinessInfoTab) => void;
  setInputMode: (mode: InputMode) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  applyExtractedData: (type: 'company' | 'client') => void;
  downloadTemplate?: (type: 'company' | 'client' | 'invoice') => void;
}

export const BusinessInformationSection: React.FC<BusinessInformationSectionProps> = ({ 
  invoiceData, 
  onInputChange, 
  businessInfoTab, 
  inputMode, 
  isExtracting, 
  extractedData, 
  fileInputRef,
  setBusinessInfoTab,
  setInputMode,
  handleFileUpload,
  applyExtractedData,
  downloadTemplate
}) => {
  const [contacts, setContacts] = useState(loadContacts());
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveContactType, setSaveContactType] = useState<'company' | 'client'>('company');
  const [contactToEdit, setContactToEdit] = useState<SavedContact | null>(null);
  const [saveContactName, setSaveContactName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{[key: string]: any}>({});

  // Load default company on component mount
  useEffect(() => {
    const defaultCompany = getDefaultCompany();
    if (defaultCompany && !invoiceData.companyName) {
      onInputChange('companyName', defaultCompany.name);
      onInputChange('companyEmail', defaultCompany.email);
      onInputChange('companyAddress', defaultCompany.address);
      if (defaultCompany.businessId1Label) onInputChange('businessId1Label', defaultCompany.businessId1Label);
      if (defaultCompany.businessId1Value) onInputChange('businessId1Value', defaultCompany.businessId1Value);
      if (defaultCompany.businessId2Label) onInputChange('businessId2Label', defaultCompany.businessId2Label);
      if (defaultCompany.businessId2Value) onInputChange('businessId2Value', defaultCompany.businessId2Value);
    }
  }, []);

  // Refresh contacts when needed
  const refreshContacts = () => {
    setContacts(loadContacts());
  };

  // Handle saving contact
  const handleSaveContact = () => {
    if (!saveContactName.trim()) return;
    
    if (contactNameExists(saveContactName, saveContactType, contactToEdit?.id)) {
      alert('A contact with this name already exists!');
      return;
    }

    const contactData = saveContactType === 'company' ? {
      type: 'company' as const,
      name: saveContactName.trim(),
      email: invoiceData.companyEmail,
      address: invoiceData.companyAddress,
      businessId1Label: invoiceData.businessId1Label,
      businessId1Value: invoiceData.businessId1Value,
      businessId2Label: invoiceData.businessId2Label,
      businessId2Value: invoiceData.businessId2Value,
      isDefault: contacts.companies.length === 0 // First company becomes default
    } : {
      type: 'client' as const,
      name: saveContactName.trim(),
      email: invoiceData.clientEmail,
      address: invoiceData.clientAddress
    };

    if (contactToEdit) {
      updateContact(contactToEdit.id, { ...contactData, name: saveContactName.trim() });
    } else {
      saveContact(contactData);
    }

    refreshContacts();
    setShowSaveDialog(false);
    setSaveContactName('');
    setContactToEdit(null);
  };

  // Handle loading contact
  const handleLoadContact = (contact: SavedContact) => {
    if (contact.type === 'company') {
      onInputChange('companyName', contact.name);
      onInputChange('companyEmail', contact.email);
      onInputChange('companyAddress', contact.address);
      if (contact.businessId1Label) onInputChange('businessId1Label', contact.businessId1Label);
      if (contact.businessId1Value) onInputChange('businessId1Value', contact.businessId1Value);
      if (contact.businessId2Label) onInputChange('businessId2Label', contact.businessId2Label);
      if (contact.businessId2Value) onInputChange('businessId2Value', contact.businessId2Value);
    } else {
      onInputChange('clientName', contact.name);
      onInputChange('clientEmail', contact.email);
      onInputChange('clientAddress', contact.address);
    }
  };

  // Handle making company default
  const handleSetDefault = (contactId: string) => {
    updateContact(contactId, { isDefault: true });
    refreshContacts();
  };

  // Handle deleting contact
  const handleDeleteContact = (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contactId);
      refreshContacts();
    }
  };

  // Handle section editing
  const handleStartEditing = (type: 'company' | 'client') => {
    setIsEditingSection(true);
    setBusinessInfoTab(type);
    // Initialize pending changes with current values
    if (type === 'company') {
      setPendingChanges({
        companyName: invoiceData.companyName,
        companyEmail: invoiceData.companyEmail,
        companyAddress: invoiceData.companyAddress,
        businessId1Label: invoiceData.businessId1Label,
        businessId1Value: invoiceData.businessId1Value,
        businessId2Label: invoiceData.businessId2Label,
        businessId2Value: invoiceData.businessId2Value,
      });
    } else {
      setPendingChanges({
        clientName: invoiceData.clientName,
        clientEmail: invoiceData.clientEmail,
        clientAddress: invoiceData.clientAddress,
      });
    }
  };

  const handleCancelEditing = () => {
    setIsEditingSection(false);
    setPendingChanges({});
  };

  const handleConfirmEditing = () => {
    // Apply all pending changes
    Object.entries(pendingChanges).forEach(([field, value]) => {
      onInputChange(field as keyof InvoiceData, value);
    });
    setIsEditingSection(false);
    setPendingChanges({});
  };

  const handlePendingChange = (field: keyof InvoiceData, value: string) => {
    setPendingChanges(prev => ({ ...prev, [field]: value }));
  };

  // Get current value (pending change or actual data)
  const getCurrentValue = (field: keyof InvoiceData) => {
    return pendingChanges[field] !== undefined ? pendingChanges[field] : invoiceData[field];
  };

  // Open save dialog
  const openSaveDialog = (type: 'company' | 'client') => {
    setSaveContactType(type);
    setSaveContactName(type === 'company' ? invoiceData.companyName : invoiceData.clientName);
    setContactToEdit(null);
    setShowSaveDialog(true);
  };

  // Edit contact
  const openEditDialog = (contact: SavedContact) => {
    setContactToEdit(contact);
    setSaveContactType(contact.type);
    setSaveContactName(contact.name);
    setShowSaveDialog(true);
  };

  // Get filtered contacts
  const getFilteredContacts = (type: 'company' | 'client') => {
    return searchContacts(searchQuery, type);
  };

  return (
    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-slate-900">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            Business Information
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setInputMode(inputMode === 'manual' ? 'upload' : 'manual')}
              variant="outline"
              size="sm"
              className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
              disabled={isEditingSection}
            >
              {inputMode === 'manual' ? (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Manual
                </>
              )}
            </Button>
          </div>
        </div>
        <p className="text-slate-500 text-sm mt-2">
          {isEditingSection 
            ? `Editing ${businessInfoTab === 'company' ? 'company' : 'client'} information. Make your changes and confirm when done.`
            : inputMode === 'manual' 
              ? 'Enter your company and client information manually, or switch to upload mode to extract data from documents.'
              : 'Upload a PDF invoice, business card, or image to automatically extract business information.'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {inputMode === 'upload' ? (
          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {isExtracting ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <div>
                    <p className="text-slate-900">Extracting information...</p>
                    <p className="text-slate-500 text-sm">Please wait while we process your document</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FileImage className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Scan className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-900 mb-2">Upload Business Documents</p>
                    <p className="text-slate-500 text-sm mb-4">
                      Drop files here or click to browse<br/>
                      Supports PDF, JPG, PNG, JSON, TXT files
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 hover:bg-blue-700 text-white mb-6"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>

                    {downloadTemplate && (
                      <div className="mt-4 pt-6 border-t border-slate-200">
                        <p className="text-slate-700 text-xs font-semibold mb-2">
                          💡 Offline Import Templates (No AI keys needed)
                        </p>
                        <p className="text-slate-500 text-xs mb-4">
                          Download a template, fill it in, and upload it (.json or .txt) to instantly import your data.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.preventDefault(); downloadTemplate('company'); }}
                            className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            Company Profile JSON
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.preventDefault(); downloadTemplate('client'); }}
                            className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            Client Profile JSON
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.preventDefault(); downloadTemplate('invoice'); }}
                            className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            Full Invoice JSON
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Extracted Data Display */}
            {extractedData && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-700 text-sm mb-2">
                    <Check className="w-4 h-4 inline mr-2" />
                    Information extracted successfully!
                  </p>
                  <p className="text-green-600 text-xs">
                    Review the extracted data and apply it to your invoice.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Data */}
                  <Card className="border-slate-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Company Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <p className="text-slate-500">Name</p>
                        <p className="text-slate-900">{extractedData.company.name}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-slate-500">Email</p>
                        <p className="text-slate-900">{extractedData.company.email}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-slate-500">Address</p>
                        <p className="text-slate-900 whitespace-pre-line">{extractedData.company.address}</p>
                      </div>
                      <Button
                        onClick={() => applyExtractedData('company')}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Apply Company Data
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Client Data */}
                  <Card className="border-slate-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Client Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <p className="text-slate-500">Name</p>
                        <p className="text-slate-900">{extractedData.client.name}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-slate-500">Email</p>
                        <p className="text-slate-900">{extractedData.client.email}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-slate-500">Address</p>
                        <p className="text-slate-900 whitespace-pre-line">{extractedData.client.address}</p>
                      </div>
                      <Button
                        onClick={() => applyExtractedData('client')}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Apply Client Data
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Tabs value={businessInfoTab} onValueChange={(value) => setBusinessInfoTab(value as BusinessInfoTab)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="company" className="flex items-center gap-2" disabled={isEditingSection && businessInfoTab !== 'company'}>
                <Building2 className="w-4 h-4" />
                Your Company
              </TabsTrigger>
              <TabsTrigger value="client" className="flex items-center gap-2" disabled={isEditingSection && businessInfoTab !== 'client'}>
                <User className="w-4 h-4" />
                Client
              </TabsTrigger>
            </TabsList>

            <TabsContent value="company" className="space-y-6">
              {/* Company Contact Management */}
              {!isEditingSection && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-slate-900 text-sm font-medium">Saved Company Profiles</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleStartEditing('company')}
                      size="sm"
                      variant="ghost"
                      className="p-2 hover:bg-blue-100"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                  </div>
                </div>
              )}

              {isEditingSection && businessInfoTab === 'company' && (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Edit className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-slate-900 text-sm font-medium">Editing Company Information</p>
                      <p className="text-slate-500 text-xs">Make your changes and confirm when done</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleCancelEditing}
                      variant="outline"
                      size="sm"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmEditing}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              )}

              {/* Saved Company Contacts */}
              {!isEditingSection && contacts.companies.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-slate-700 text-sm">Load Saved Company:</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {contacts.companies.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => handleLoadContact(contact)}
                            className="flex items-center gap-2 text-left flex-1 hover:text-blue-600 transition-colors"
                          >
                            {contact.isDefault && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            <div>
                              <p className="text-slate-900 text-sm font-medium">{contact.name}</p>
                              <p className="text-slate-500 text-xs">{contact.email}</p>
                            </div>
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          {!contact.isDefault && (
                            <Button
                              onClick={() => handleSetDefault(contact.id)}
                              size="sm"
                              variant="ghost"
                              className="p-1 h-8 w-8"
                              title="Set as default"
                            >
                              <StarOff className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            onClick={() => openEditDialog(contact)}
                            size="sm"
                            variant="ghost"
                            className="p-1 h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteContact(contact.id)}
                            size="sm"
                            variant="ghost"
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Form Fields */}
              <div className="space-y-6">
                {/* Dedicated Company Logo Section */}
                <div className="space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50 shadow-sm">
                  <Label className="text-slate-700 font-medium block">Company Logo</Label>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Logo Preview */}
                    <div className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center bg-white shadow-sm" style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px' }}>
                      {invoiceData.logoUrl ? (
                        <img
                          src={invoiceData.logoUrl}
                          alt="Company Logo Preview"
                          className="w-full h-full object-contain p-1.5"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                          <span className="text-[10px] text-slate-400 block font-normal">No Logo</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Controls */}
                    <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        <input
                          id="logo-upload-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target?.result as string;
                                onInputChange('logoUrl', base64);
                                if (isEditingSection) {
                                  handlePendingChange('logoUrl', base64);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          onClick={() => document.getElementById('logo-upload-input')?.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm h-9 px-4 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 mr-2" />
                          Upload Logo
                        </Button>
                        {invoiceData.logoUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              onInputChange('logoUrl', '');
                              if (isEditingSection) {
                                handlePendingChange('logoUrl', '');
                              }
                            }}
                            className="border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold h-9 px-4 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Remove Logo
                          </Button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Supported formats: PNG, JPG, SVG. Recommended square or horizontal layout. Max size 1MB.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-slate-700">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Your Company LLC"
                    value={isEditingSection ? getCurrentValue('companyName') : invoiceData.companyName}
                    onChange={(e) => isEditingSection ? handlePendingChange('companyName', e.target.value) : onInputChange('companyName', e.target.value)}
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                    disabled={!isEditingSection}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail" className="text-slate-700">Email Address</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    placeholder="hello@company.com"
                    value={isEditingSection ? getCurrentValue('companyEmail') : invoiceData.companyEmail}
                    onChange={(e) => isEditingSection ? handlePendingChange('companyEmail', e.target.value) : onInputChange('companyEmail', e.target.value)}
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                    disabled={!isEditingSection}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress" className="text-slate-700">Address & Contact Info</Label>
                  <Textarea
                    id="companyAddress"
                    placeholder="123 Business Street, Suite 100&#10;City, State 12345&#10;Phone: (555) 123-4567"
                    value={isEditingSection ? getCurrentValue('companyAddress') : invoiceData.companyAddress}
                    onChange={(e) => isEditingSection ? handlePendingChange('companyAddress', e.target.value) : onInputChange('companyAddress', e.target.value)}
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 min-h-[100px]"
                    disabled={!isEditingSection}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessId1Label" className="text-slate-700">Business ID #1 Label</Label>
                    <Input
                      id="businessId1Label"
                      placeholder="Tax ID"
                      value={isEditingSection ? getCurrentValue('businessId1Label') : invoiceData.businessId1Label}
                      onChange={(e) => isEditingSection ? handlePendingChange('businessId1Label', e.target.value) : onInputChange('businessId1Label', e.target.value)}
                      className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                      disabled={!isEditingSection}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessId1Value" className="text-slate-700">Business ID #1 Value</Label>
                    <Input
                      id="businessId1Value"
                      placeholder="123-45-6789"
                      value={isEditingSection ? getCurrentValue('businessId1Value') : invoiceData.businessId1Value}
                      onChange={(e) => isEditingSection ? handlePendingChange('businessId1Value', e.target.value) : onInputChange('businessId1Value', e.target.value)}
                      className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                      disabled={!isEditingSection}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessId2Label" className="text-slate-700">Business ID #2 Label</Label>
                    <Input
                      id="businessId2Label"
                      placeholder="Business License"
                      value={isEditingSection ? getCurrentValue('businessId2Label') : invoiceData.businessId2Label}
                      onChange={(e) => isEditingSection ? handlePendingChange('businessId2Label', e.target.value) : onInputChange('businessId2Label', e.target.value)}
                      className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                      disabled={!isEditingSection}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessId2Value" className="text-slate-700">Business ID #2 Value</Label>
                    <Input
                      id="businessId2Value"
                      placeholder="BL-987654321"
                      value={isEditingSection ? getCurrentValue('businessId2Value') : invoiceData.businessId2Value}
                      onChange={(e) => isEditingSection ? handlePendingChange('businessId2Value', e.target.value) : onInputChange('businessId2Value', e.target.value)}
                      className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                      disabled={!isEditingSection}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="client" className="space-y-6">
              {/* Client Contact Management */}
              {!isEditingSection && (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-slate-900 text-sm font-medium">Saved Client Profiles</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleStartEditing('client')}
                      size="sm"
                      variant="ghost"
                      className="p-2 hover:bg-green-100"
                    >
                      <Edit className="w-4 h-4 text-green-600" />
                    </Button>
                  </div>
                </div>
              )}

              {isEditingSection && businessInfoTab === 'client' && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Edit className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-slate-900 text-sm font-medium">Editing Client Information</p>
                      <p className="text-slate-500 text-xs">Make your changes and confirm when done</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleCancelEditing}
                      variant="outline"
                      size="sm"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmEditing}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              )}

              {/* Client Search and List */}
              {!isEditingSection && contacts.clients.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-slate-700 text-sm">Load Saved Client:</Label>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                    />
                  </div>

                  {/* Client List */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getFilteredContacts('client').map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <button
                          onClick={() => handleLoadContact(contact)}
                          className="flex items-center gap-2 text-left flex-1 hover:text-green-600 transition-colors"
                        >
                          <div>
                            <p className="text-slate-900 text-sm font-medium">{contact.name}</p>
                            <p className="text-slate-500 text-xs">{contact.email}</p>
                          </div>
                        </button>
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() => openEditDialog(contact)}
                            size="sm"
                            variant="ghost"
                            className="p-1 h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteContact(contact.id)}
                            size="sm"
                            variant="ghost"
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Form Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-slate-700">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="Client Company Name"
                    value={isEditingSection ? getCurrentValue('clientName') : invoiceData.clientName}
                    onChange={(e) => isEditingSection ? handlePendingChange('clientName', e.target.value) : onInputChange('clientName', e.target.value)}
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                    disabled={!isEditingSection}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="text-slate-700">Email Address</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@company.com"
                    value={isEditingSection ? getCurrentValue('clientEmail') : invoiceData.clientEmail}
                    onChange={(e) => isEditingSection ? handlePendingChange('clientEmail', e.target.value) : onInputChange('clientEmail', e.target.value)}
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                    disabled={!isEditingSection}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientAddress" className="text-slate-700">Address & Contact Info</Label>
                  <Textarea
                    id="clientAddress"
                    placeholder="Client address and contact information"
                    value={isEditingSection ? getCurrentValue('clientAddress') : invoiceData.clientAddress}
                    onChange={(e) => isEditingSection ? handlePendingChange('clientAddress', e.target.value) : onInputChange('clientAddress', e.target.value)}
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 min-h-[80px]"
                    disabled={!isEditingSection}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      {/* Save Contact Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="w-5 h-5 text-blue-600" />
              {contactToEdit ? 'Edit' : 'Save'} {saveContactType === 'company' ? 'Company' : 'Client'} Contact
            </DialogTitle>
            <DialogDescription>
              {contactToEdit ? 'Update the contact information.' : `Save current ${saveContactType} information to reuse in future invoices.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-slate-700">Contact Name</Label>
              <Input
                id="contactName"
                placeholder={`${saveContactType === 'company' ? 'Company' : 'Client'} name`}
                value={saveContactName}
                onChange={(e) => setSaveContactName(e.target.value)}
                className="bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
              />
            </div>
            
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-slate-700 text-sm mb-2">Preview:</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Email:</strong> {saveContactType === 'company' ? invoiceData.companyEmail : invoiceData.clientEmail}</p>
                <p><strong>Address:</strong> {(saveContactType === 'company' ? invoiceData.companyAddress : invoiceData.clientAddress).split('\n')[0]}...</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                onClick={() => setShowSaveDialog(false)}
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveContact}
                disabled={!saveContactName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {contactToEdit ? 'Update' : 'Save'} Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};