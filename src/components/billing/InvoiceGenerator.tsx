'use client';

import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Invoice, { InvoiceData } from './Invoice';
import { getBillingSettings, BillingSettings } from '@/services/billingService';

interface InvoiceGeneratorProps {
  invoiceType: 'consultation' | 'laboratory' | 'pharmacy';
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    hsn?: string;
  }[];
  onClose: () => void;
  onSuccess?: (invoiceData: InvoiceData) => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  invoiceType,
  patientId,
  patientName,
  doctorId,
  doctorName,
  items,
  onClose,
  onSuccess
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState(0);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [settings, setSettings] = useState<BillingSettings | null>(null);

  // Calculate totals
  const calculateTotals = (items: any[], gstPercentage: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const gstAmount = (subtotal * gstPercentage) / 100;
    const totalAmount = subtotal + gstAmount;
    
    return {
      subtotal,
      gstAmount,
      totalAmount
    };
  };

  // Handle print invoice
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  // Generate invoice
  const generateInvoice = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, we would call the API here
      // const response = await createInvoice({
      //   patientId,
      //   doctorId,
      //   items: items.map(item => ({
      //     description: item.description,
      //     quantity: item.quantity,
      //     unitPrice: item.unitPrice,
      //     hsn: item.hsn
      //   })),
      //   notes: '',
      //   paymentMethod,
      //   paidAmount: parseFloat(paidAmount.toString()),
      //   invoiceType
      // });
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get billing settings (in a real app, this would be fetched from API)
      const billingSettings = await getBillingSettings();
      setSettings(billingSettings);
      
      const { subtotal, gstAmount, totalAmount } = calculateTotals(
        items, 
        billingSettings.gstPercentage
      );
      
      const paidAmt = parseFloat(paidAmount.toString()) || 0;
      const balanceDue = totalAmount - paidAmt;
      
      // Generate a unique invoice number
      const invoiceNumber = `${billingSettings.invoicePrefix}-${new Date().getTime().toString().slice(-8)}`;
      
      // Create invoice data
      const invoice: InvoiceData = {
        invoiceNumber,
        invoiceDate: new Date(),
        patientInfo: {
          id: patientId,
          name: patientName
        },
        doctorInfo: doctorId && doctorName ? {
          id: doctorId,
          name: doctorName
        } : undefined,
        items: items.map(item => ({
          ...item,
          amount: item.quantity * item.unitPrice,
          gstRate: billingSettings.gstPercentage
        })),
        subtotal,
        gstNumber: billingSettings.gstNumber,
        gstPercentage: billingSettings.gstPercentage,
        gstAmount,
        totalAmount,
        paidAmount: paidAmt,
        balanceDue,
        paymentMethod,
        paymentStatus: paidAmt === 0 ? 'unpaid' : 
                      paidAmt < totalAmount ? 'partial' : 'paid',
        termsAndConditions: billingSettings.termsAndConditions,
        hospitalName: 'City General Hospital',
        hospitalAddress: '123 Healthcare Avenue, Medical District\nBangalore, Karnataka 560001',
        hospitalContact: '(123) 456-7890',
        hospitalEmail: 'care@generalhospital.com',
        currency: billingSettings.currency
      };
      
      setInvoiceData(invoice);
      
      if (onSuccess) {
        onSuccess(invoice);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate invoice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Generate {invoiceType === 'consultation' ? 'Consultation'
                  : invoiceType === 'laboratory' ? 'Laboratory'
                  : 'Pharmacy'} Invoice
        </h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-primary-600 flex items-center text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Invoices
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}
      
      {!invoiceData ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Invoice Summary</h3>
            <div className="bg-gray-50 p-4 rounded border">
              <p><strong>Patient:</strong> {patientName}</p>
              {doctorName && <p><strong>Doctor:</strong> Dr. {doctorName}</p>}
              <p><strong>Items:</strong> {items.length}</p>
              <p><strong>Total Amount:</strong> ₹ {items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}</p>
            </div>
          </div>
          
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
            >
              <option value="Cash">Cash</option>
              <option value="UPI" disabled>UPI (Coming Soon)</option>
              <option value="Card" disabled>Card (Coming Soon)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Paid Amount
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 rounded-l-md border border-r-0 border-gray-300">
                ₹
              </span>
              <input
                type="number"
                id="paidAmount"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                min="0"
                step="0.01"
                className="block w-full rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={generateInvoice}
              disabled={isLoading}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : 'Generate Invoice'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
            Invoice generated successfully!
          </div>
          
          <div className="overflow-auto max-h-[60vh] border rounded">
            <Invoice ref={invoiceRef} data={invoiceData} />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Print / Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;