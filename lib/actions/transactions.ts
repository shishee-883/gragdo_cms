'use server'

import { transactionsApi } from '@/lib/services/api';

export async function createTransactionRecord(data: {
  amount: number;
  type: string;
  description: string;
  paymentMethod: string;
  paymentStatus: string;
  invoiceId?: string;
  appointmentId?: string;
  patientId?: string;
  doctorId?: string;
  clinicId: string;
  createdById: string;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const response = await transactionsApi.createTransaction(data);
    
    if (response.success) {
      return { success: true, transaction: response.transaction };
    } else {
      return { success: false, error: response.error || 'Failed to create transaction' };
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { success: false, error: 'Failed to create transaction' };
  }
}

export async function updateTransactionRecord(id: string, data: {
  description?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const response = await transactionsApi.updateTransaction(id, data);
    
    if (response.success) {
      return { success: true, transaction: response.transaction };
    } else {
      return { success: false, error: response.error || 'Failed to update transaction' };
    }
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { success: false, error: 'Failed to update transaction' };
  }
}

export async function deleteTransactionRecord(id: string) {
  try {
    const response = await transactionsApi.deleteTransaction(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete transaction' };
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { success: false, error: 'Failed to delete transaction' };
  }
}

export async function getTransactions(clinicId?: string, patientId?: string, type?: string) {
  try {
    const response = await transactionsApi.getTransactions({
      clinicId,
      patientId,
      type
    });
    
    if (response.success) {
      return response.transactions;
    } else {
      console.error('Error fetching transactions:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function getTransactionById(id: string) {
  try {
    const response = await transactionsApi.getTransaction(id);
    
    if (response.success) {
      return response.transaction;
    } else {
      console.error('Error fetching transaction:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
}

export async function getTransactionSummary(clinicId: string, period: 'day' | 'week' | 'month' | 'year' = 'month') {
  try {
    const response = await transactionsApi.getTransactionSummary(clinicId, period);
    
    if (response.success) {
      return response.summary;
    } else {
      console.error('Error fetching transaction summary:', response.error);
      return {
        period,
        income: 0,
        expense: 0,
        refund: 0,
        net: 0,
        paymentMethods: {},
        transactionCount: 0
      };
    }
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    return {
      period,
      income: 0,
      expense: 0,
      refund: 0,
      net: 0,
      paymentMethods: {},
      transactionCount: 0
    };
  }
}