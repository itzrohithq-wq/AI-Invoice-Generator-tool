import { SavedContact, ContactList } from '../types/invoice';

const CONTACTS_STORAGE_KEY = 'invoice_contacts';

// Load contacts from localStorage
export const loadContacts = (): ContactList => {
  try {
    const stored = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
  
  return {
    companies: [],
    clients: []
  };
};

// Save contacts to localStorage
export const saveContacts = (contacts: ContactList): void => {
  try {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error('Error saving contacts:', error);
  }
};

// Save a new contact
export const saveContact = (contact: Omit<SavedContact, 'id' | 'createdAt' | 'updatedAt'>): SavedContact => {
  const contacts = loadContacts();
  const now = new Date().toISOString();
  
  const newContact: SavedContact = {
    ...contact,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: now,
    updatedAt: now
  };

  if (contact.type === 'company') {
    // If this is being marked as default, unmark any existing default
    if (newContact.isDefault) {
      contacts.companies = contacts.companies.map(c => ({ ...c, isDefault: false }));
    }
    // If this is the first company contact, make it default
    if (contacts.companies.length === 0) {
      newContact.isDefault = true;
    }
    contacts.companies.push(newContact);
  } else {
    contacts.clients.push(newContact);
  }
  
  saveContacts(contacts);
  return newContact;
};

// Update an existing contact
export const updateContact = (id: string, updates: Partial<SavedContact>): SavedContact | null => {
  const contacts = loadContacts();
  const now = new Date().toISOString();
  
  // Find and update in companies
  const companyIndex = contacts.companies.findIndex(c => c.id === id);
  if (companyIndex !== -1) {
    const updatedContact = {
      ...contacts.companies[companyIndex],
      ...updates,
      updatedAt: now
    };
    
    // Handle default company logic
    if (updates.isDefault && updatedContact.isDefault) {
      contacts.companies = contacts.companies.map(c => ({ ...c, isDefault: false }));
      updatedContact.isDefault = true;
    }
    
    contacts.companies[companyIndex] = updatedContact;
    saveContacts(contacts);
    return updatedContact;
  }
  
  // Find and update in clients
  const clientIndex = contacts.clients.findIndex(c => c.id === id);
  if (clientIndex !== -1) {
    const updatedContact = {
      ...contacts.clients[clientIndex],
      ...updates,
      updatedAt: now
    };
    contacts.clients[clientIndex] = updatedContact;
    saveContacts(contacts);
    return updatedContact;
  }
  
  return null;
};

// Delete a contact
export const deleteContact = (id: string): boolean => {
  const contacts = loadContacts();
  
  const companyIndex = contacts.companies.findIndex(c => c.id === id);
  if (companyIndex !== -1) {
    const wasDefault = contacts.companies[companyIndex].isDefault;
    contacts.companies.splice(companyIndex, 1);
    
    // If we deleted the default company and there are others, make the first one default
    if (wasDefault && contacts.companies.length > 0) {
      contacts.companies[0].isDefault = true;
    }
    
    saveContacts(contacts);
    return true;
  }
  
  const clientIndex = contacts.clients.findIndex(c => c.id === id);
  if (clientIndex !== -1) {
    contacts.clients.splice(clientIndex, 1);
    saveContacts(contacts);
    return true;
  }
  
  return false;
};

// Get default company contact
export const getDefaultCompany = (): SavedContact | null => {
  const contacts = loadContacts();
  return contacts.companies.find(c => c.isDefault) || contacts.companies[0] || null;
};

// Check if contact name already exists
export const contactNameExists = (name: string, type: 'company' | 'client', excludeId?: string): boolean => {
  const contacts = loadContacts();
  const list = type === 'company' ? contacts.companies : contacts.clients;
  
  return list.some(contact => 
    contact.name.toLowerCase() === name.toLowerCase() && 
    contact.id !== excludeId
  );
};

// Search contacts by name
export const searchContacts = (query: string, type: 'company' | 'client'): SavedContact[] => {
  const contacts = loadContacts();
  const list = type === 'company' ? contacts.companies : contacts.clients;
  
  if (!query.trim()) return list;
  
  const lowercaseQuery = query.toLowerCase();
  return list.filter(contact =>
    contact.name.toLowerCase().includes(lowercaseQuery) ||
    contact.email.toLowerCase().includes(lowercaseQuery)
  );
};