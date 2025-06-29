'use server'

import { billingApi } from '@/lib/services/api';

export async function createInvoiceRecord(data: {
  patientId: string;
  clinicId: string;
  appointmentId?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    type: string;
    medicineId?: string;
    treatmentId?: string;
  }[];
  discount: number;
  tax: number;
  dueDate: string;
  notes?: string;
  createdById: string;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const response = await billingApi.createInvoice(data);
    
    if (response.success) {
      return { success: true, invoice: response.invoice };
    } else {
      return { success: false, error: response.error || 'Failed to create invoice' };
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
    return { success: false, error: 'Failed to create invoice' };
  }
}

export async function updateInvoiceRecord(id: string, data: {
  items?: {
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    type: string;
    medicineId?: string;
    treatmentId?: string;
  }[];
  discount?: number;
  tax?: number;
  dueDate?: string;
  status?: string;
  notes?: string;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const response = await billingApi.updateInvoice(id, data);
    
    if (response.success) {
      return { success: true, invoice: response.invoice };
    } else {
      return { success: false, error: response.error || 'Failed to update invoice' };
    }
  } catch (error) {
    console.error('Error updating invoice:', error);
    return { success: false, error: 'Failed to update invoice' };
  }
}

export async function deleteInvoiceRecord(id: string) {
  try {
    const response = await billingApi.deleteInvoice(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete invoice' };
    }
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return { success: false, error: 'Failed to delete invoice' };
  }
}

export async function getInvoices(clinicId?: string, patientId?: string, status?: string) {
  try {
    const response = await billingApi.getInvoices({
      clinicId,
      patientId,
      status
    });
    
    if (response.success) {
      return response.invoices;
    } else {
      console.error('Error fetching invoices:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export async function getInvoiceById(id: string) {
  try {
    const response = await billingApi.getInvoice(id);
    
    if (response.success) {
      return response.invoice;
    } else {
      console.error('Error fetching invoice:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
}

export async function recordPayment(data: {
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  description: string;
  patientId: string;
  clinicId: string;
  createdById: string;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const response = await billingApi.recordPayment(data);
    
    if (response.success) {
      return { success: true, transaction: response.transaction };
    } else {
      return { success: false, error: response.error || 'Failed to record payment' };
    }
  } catch (error) {
    console.error('Error recording payment:', error);
    return { success: false, error: 'Failed to record payment' };
  }
}