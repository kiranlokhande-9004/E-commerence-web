export interface PaymentPayload {
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'cod';
  cardDetails?: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    nameOnCard: string;
  };
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}

/**
 * Payment Gateway UI Adapter
 * Front-end adapter abstraction: no client secret keys.
 * In production, this forwards tokens to the server-side payment endpoint.
 */
export async function processPayment(payload: PaymentPayload): Promise<PaymentResult> {
  // Simulate network latency (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (payload.paymentMethod === 'card') {
    // Basic sanity check on dummy card (e.g. Reject 4000 0000 0000 0002 for simulated decline)
    if (payload.cardDetails?.cardNumber.replace(/\s+/g, '').endsWith('0002')) {
      return {
        success: false,
        errorMessage: 'Your card was declined. Please try another payment method.',
      };
    }
  }

  // Generate simulated reference token
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    success: true,
    transactionId,
  };
}
