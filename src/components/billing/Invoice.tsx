'use client';

import React, { forwardRef } from 'react';
import { format } from 'date-fns';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  hsn?: string; // HSN/SAC code for GST
  gstRate?: number; // GST rate in percentage
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  patientInfo: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  doctorInfo?: {
    id: string;
    name: string;
    specialization?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  gstNumber: string;
  gstPercentage: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  notes?: string;
  termsAndConditions?: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalContact: string;
  hospitalEmail: string;
  hospitalLogo?: string;
  currency: string;
}

interface InvoiceProps {
  data: InvoiceData;
}

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(({ data }, ref) => {
  const formattedInvoiceDate = format(data.invoiceDate, 'dd/MM/yyyy');
  const formattedDueDate = data.dueDate ? format(data.dueDate, 'dd/MM/yyyy') : '';

  // Function to get payment status style
  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div
      ref={ref}
      className="bg-white p-8 shadow-lg max-w-[210mm] mx-auto print:shadow-none print:mx-0"
      style={{ minHeight: '297mm', color: '#000' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 print:text-black">{data.hospitalName}</h1>
          <p className="text-gray-800 mt-1 whitespace-pre-wrap print:text-black">{data.hospitalAddress}</p>
          <p className="text-gray-800 mt-1 print:text-black">Phone: {data.hospitalContact}</p>
          <p className="text-gray-800 print:text-black">Email: {data.hospitalEmail}</p>
          {data.gstNumber && (
            <p className="text-gray-800 font-medium mt-2 print:text-black">GST No: {data.gstNumber}</p>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-primary-600 uppercase tracking-wider print:text-black">INVOICE</h2>
          <p className="text-gray-800 mt-1 print:text-black"><strong>Invoice #:</strong> {data.invoiceNumber}</p>
          <p className="text-gray-800 print:text-black"><strong>Date:</strong> {formattedInvoiceDate}</p>
          {formattedDueDate && (
            <p className="text-gray-800 print:text-black"><strong>Due Date:</strong> {formattedDueDate}</p>
          )}
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm rounded-full border ${getPaymentStatusStyle(data.paymentStatus)} print:border-black print:text-black`}
          >
            {data.paymentStatus === 'paid' ? 'PAID' :
             data.paymentStatus === 'partial' ? 'PARTIALLY PAID' : 'UNPAID'}
          </span>
        </div>
      </div>

      {/* Bill To & Doctor Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-gray-800 font-semibold mb-2 print:text-black">Bill To:</h3>
          <p className="font-medium text-gray-900 print:text-black">{data.patientInfo.name}</p>
          <p className="text-gray-800 print:text-black">Patient ID: {data.patientInfo.id}</p>
          {data.patientInfo.address && (
            <p className="text-gray-800 whitespace-pre-wrap print:text-black">{data.patientInfo.address}</p>
          )}
          {data.patientInfo.phone && (
            <p className="text-gray-800 print:text-black">Phone: {data.patientInfo.phone}</p>
          )}
          {data.patientInfo.email && (
            <p className="text-gray-800 print:text-black">Email: {data.patientInfo.email}</p>
          )}
        </div>
        {data.doctorInfo && (
          <div>
            <h3 className="text-gray-800 font-semibold mb-2 print:text-black">Attending Physician:</h3>
            <p className="font-medium text-gray-900 print:text-black">Dr. {data.doctorInfo.name}</p>
            {data.doctorInfo.specialization && (
              <p className="text-gray-800 print:text-black">{data.doctorInfo.specialization}</p>
            )}
          </div>
        )}
      </div>

      {/* Invoice Items */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 print:bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold text-gray-800 border-b print:text-black print:border-black">Description</th>
              {data.items.some(item => item.hsn) && (
                <th className="py-3 px-4 text-left font-semibold text-gray-800 border-b print:text-black print:border-black">HSN/SAC</th>
              )}
              <th className="py-3 px-4 text-right font-semibold text-gray-800 border-b print:text-black print:border-black">Qty</th>
              <th className="py-3 px-4 text-right font-semibold text-gray-800 border-b print:text-black print:border-black">Unit Price</th>
              {data.items.some(item => item.gstRate) && (
                <th className="py-3 px-4 text-right font-semibold text-gray-800 border-b print:text-black print:border-black">GST %</th>
              )}
              <th className="py-3 px-4 text-right font-semibold text-gray-800 border-b print:text-black print:border-black">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 print:bg-white'}>
                <td className="py-3 px-4 border-b text-gray-900 print:text-black print:border-gray-300">{item.description}</td>
                {data.items.some(item => item.hsn) && (
                  <td className="py-3 px-4 border-b text-center text-gray-900 print:text-black print:border-gray-300">{item.hsn || '-'}</td>
                )}
                <td className="py-3 px-4 border-b text-right text-gray-900 print:text-black print:border-gray-300">{item.quantity}</td>
                <td className="py-3 px-4 border-b text-right text-gray-900 print:text-black print:border-gray-300">{data.currency} {item.unitPrice.toFixed(2)}</td>
                {data.items.some(item => item.gstRate) && (
                  <td className="py-3 px-4 border-b text-right text-gray-900 print:text-black print:border-gray-300">{item.gstRate ? `${item.gstRate}%` : '-'}</td>
                )}
                <td className="py-3 px-4 border-b text-right text-gray-900 print:text-black print:border-gray-300">{data.currency} {item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-1/2 md:w-2/5 print:w-2/5">
          <div className="flex justify-between py-2">
            <span className="text-gray-800 print:text-black">Subtotal:</span>
            <span className="font-medium text-gray-900 print:text-black">{data.currency} {data.subtotal.toFixed(2)}</span>
          </div>
          {data.gstAmount > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-800 print:text-black">GST ({data.gstPercentage}%):</span>
              <span className="font-medium text-gray-900 print:text-black">{data.currency} {data.gstAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t border-b border-gray-300 print:border-black font-semibold">
            <span className="text-gray-900 print:text-black">Total:</span>
            <span className="text-gray-900 print:text-black">{data.currency} {data.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-800 print:text-black">Paid Amount:</span>
            <span className="font-medium text-gray-900 print:text-black">{data.currency} {data.paidAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold">
            <span className="text-gray-900 print:text-black">Balance Due:</span>
            <span className="text-gray-900 print:text-black">{data.currency} {data.balanceDue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-8">
        <p className="text-gray-800 print:text-black"><strong>Payment Method:</strong> {data.paymentMethod}</p>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="mb-8">
          <h3 className="text-gray-800 font-semibold mb-2 print:text-black">Notes:</h3>
          <p className="text-gray-800 whitespace-pre-wrap print:text-black">{data.notes}</p>
        </div>
      )}

      {/* Terms and Conditions */}
      {data.termsAndConditions && (
        <div className="mb-8">
          <h3 className="text-gray-800 font-semibold mb-2 print:text-black">Terms and Conditions:</h3>
          <p className="text-gray-800 whitespace-pre-wrap text-sm print:text-black">{data.termsAndConditions}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 text-center text-gray-700 text-sm print:text-black">
        <p>Thank you for your business!</p>
        <p className="mt-1">This is a computer-generated invoice and does not require a signature.</p>
      </div>
    </div>
  );
});

Invoice.displayName = 'Invoice';

export default Invoice;