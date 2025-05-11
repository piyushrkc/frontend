import api from '@/lib/api';
import { InvoiceData } from '@/components/billing/Invoice';

export interface BillingSettings {
  consultationFees: {
    standard: number;
    followUp: number;
    specialist: number;
    emergency: number;
  };
  gstNumber: string;
  gstPercentage: number;
  currency: string;
  paymentMethods: string[];
  invoicePrefix: string;
  termsAndConditions: string;
}

export interface CreateInvoiceRequest {
  patientId: string;
  doctorId?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    hsn?: string;
    gstRate?: number;
  }[];
  notes?: string;
  paymentMethod: string;
  paidAmount: number;
  invoiceType: 'consultation' | 'laboratory' | 'pharmacy';
}

// Get billing settings
export const getBillingSettings = async (): Promise<BillingSettings> => {
  try {
    const response = await api.get('/billing/settings');
    return response.data;
  } catch (error) {
    // Fallback mock data for demo
    return {
      consultationFees: {
        standard: 500,
        followUp: 300,
        specialist: 1000,
        emergency: 1500
      },
      gstNumber: '29AADCB2230M1ZP',
      gstPercentage: 18,
      currency: '₹',
      paymentMethods: ['Cash'],
      invoicePrefix: 'INV',
      termsAndConditions: '1. Payment is due at the time of service.\n2. Reports will be available within 24 hours of testing.\n3. Prescription refills require 48 hours notice.\n4. Missed appointments without 24 hours notice may be charged.'
    };
  }
};

// Update billing settings
export const updateBillingSettings = async (settings: BillingSettings): Promise<BillingSettings> => {
  try {
    const response = await api.put('/billing/settings', settings);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create invoice
export const createInvoice = async (invoiceData: CreateInvoiceRequest): Promise<InvoiceData> => {
  try {
    const response = await api.post('/billing/invoices', invoiceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get invoice by ID
export const getInvoice = async (invoiceId: string): Promise<InvoiceData> => {
  try {
    const response = await api.get(`/billing/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update invoice (e.g., mark as paid)
export const updateInvoice = async (invoiceId: string, data: Partial<InvoiceData>): Promise<InvoiceData> => {
  try {
    const response = await api.put(`/billing/invoices/${invoiceId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all invoices with filters
export const getInvoices = async (filters?: {
  patientId?: string;
  doctorId?: string;
  startDate?: Date;
  endDate?: Date;
  paymentStatus?: 'paid' | 'partial' | 'unpaid';
  invoiceType?: 'consultation' | 'laboratory' | 'pharmacy';
}): Promise<InvoiceData[]> => {
  try {
    const response = await api.get('/billing/invoices', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generate invoice for consultation
export const generateConsultationInvoice = async (
  appointmentId: string,
  paymentMethod: string,
  paidAmount: number
): Promise<InvoiceData> => {
  try {
    const response = await api.post('/billing/invoices/consultation', {
      appointmentId,
      paymentMethod,
      paidAmount
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generate invoice for laboratory tests
export const generateLabInvoice = async (
  labTestIds: string[],
  patientId: string,
  paymentMethod: string,
  paidAmount: number
): Promise<InvoiceData> => {
  try {
    const response = await api.post('/billing/invoices/laboratory', {
      labTestIds,
      patientId,
      paymentMethod,
      paidAmount
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generate invoice for pharmacy
export const generatePharmacyInvoice = async (
  prescriptionId: string,
  paymentMethod: string,
  paidAmount: number
): Promise<InvoiceData> => {
  try {
    const response = await api.post('/billing/invoices/pharmacy', {
      prescriptionId,
      paymentMethod,
      paidAmount
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};