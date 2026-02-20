import api from './client';

export interface PhonePeCreateRequest {
  amount: number;
  orderId?: string;
  redirectUrl?: string;
}

export interface PhonePeCreateResponse {
  paymentAttemptId: string;
  provider: 'phonepe';
  status: 'created' | 'pending' | 'success' | 'failed' | 'expired' | 'cancelled';
  redirectUrl: string | null;
  merchantTransactionId?: string;
  disabled?: boolean;
  mock?: boolean;
}

export interface PaymentAttemptStatus {
  paymentAttemptId: string;
  status: 'created' | 'pending' | 'success' | 'failed' | 'expired' | 'cancelled';
  redirectUrl: string | null;
  providerTxnId: string | null;
  failureReason: string | null;
  expiresAt: string | null;
}

export interface OrderPaymentStatus {
  orderId: string;
  paymentStatus: 'pending' | 'success' | 'failed' | 'refunded' | 'not_applicable';
  paymentProvider: string | null;
  paymentAttemptId: string | null;
  providerTxnId: string | null;
  redirectUrl: string | null;
  failureReason: string | null;
}

export const createPhonePePayment = async (payload: PhonePeCreateRequest) => {
  return api.post<PhonePeCreateResponse>('/payments/phonepe/create', payload);
};

export const getPaymentAttemptStatus = async (attemptId: string) => {
  return api.get<PaymentAttemptStatus>(`/payments/attempt/${attemptId}/status`);
};

export const getOrderPaymentStatus = async (orderId: string) => {
  return api.get<OrderPaymentStatus>(`/payments/${orderId}/status`);
};

export default {
  createPhonePePayment,
  getPaymentAttemptStatus,
  getOrderPaymentStatus,
};
