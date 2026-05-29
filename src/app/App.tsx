import React from 'react';
import { InvoiceGenerator } from './components/InvoiceGenerator';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <InvoiceGenerator />
    </div>
  );
}