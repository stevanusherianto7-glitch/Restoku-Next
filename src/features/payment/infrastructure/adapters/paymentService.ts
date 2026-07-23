import { apiClient } from "@shared/infrastructure/http/apiClient";
import type {
  PaymentTransaction,
  WebhookPayload,
  PaymentStatus,
} from "@features/payment/domain/entities/Payment";

interface CreatePaymentParams {
  orderId: string;
  paymentMethod: string;
  amount: number;
}

interface PaymentGatewayResponse {
  transaction_id: string;
  redirect_url?: string;
  status: string;
}

class PaymentService {
  async createPayment(params: CreatePaymentParams): Promise<PaymentGatewayResponse> {
    const response = await apiClient.post<{
      success: boolean;
      data: PaymentGatewayResponse;
    }>("/payments/create", params);

    return response.data.data;
  }

  async getPaymentStatus(orderId: string): Promise<PaymentTransaction> {
    const response = await apiClient.get<{
      success: boolean;
      data: PaymentTransaction;
    }>(`/payments/status/${orderId}`);

    return response.data.data;
  }

  async refundPayment(orderId: string, reason: string): Promise<void> {
    await apiClient.post(`/payments/refund/${orderId}`, { reason });
  }

  async verifyWebhookSignature(
    payload: WebhookPayload,
    signature: string,
    timestamp: string,
    secret: string
  ): Promise<boolean> {
    const encoder = new TextEncoder();
    const payloadString = `${timestamp}.${JSON.stringify(payload)}`;
    const keyData = encoder.encode(secret);
    const data = encoder.encode(payloadString);

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, data);
    const expected = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return signature === expected;
  }

  mapGatewayStatus(
    gatewayStatus: string
  ): PaymentStatus {
    const map: Record<string, PaymentStatus> = {
      pending: "pending",
      capture: "processing",
      settlement: "paid",
      success: "paid",
      expire: "expired",
      deny: "failed",
      refund: "refunded",
      partial_refund: "refunded",
    };
    return map[gatewayStatus] ?? "pending";
  }
}

export const paymentService = new PaymentService();
