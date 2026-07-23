export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "refunded"
  | "expired";

export type PaymentMethod =
  | "bank_transfer"
  | "credit_card"
  | "debit_card"
  | "ewallet"
  | "qris"
  | "cash";

export type GatewayStatus =
  | "pending"
  | "capture"
  | "settlement"
  | "success"
  | "expire"
  | "deny"
  | "refund"
  | "partial_refund";

export interface PaymentTransaction {
  id: string;
  orderId: string;
  tenantId: string;
  gatewayTransactionId?: string;
  status: PaymentStatus;
  amount: number;
  paymentMethod: PaymentMethod;
  idempotencyKey: string;
  createdAt: string;
  paidAt?: string;
}

export interface WebhookPayload {
  order_id: string;
  transaction_id: string;
  status: GatewayStatus;
  final_amount: number;
  payment_type: string;
  fraud_status?: string;
  settlement_time?: string;
  expiry_time?: string;
  signature_key: string;
}

export interface PaymentVerificationResult {
  valid: boolean;
  reason?: string;
}

export const GATEWAY_STATUS_MAP: Record<GatewayStatus, PaymentStatus> = {
  pending: "pending",
  capture: "processing",
  settlement: "paid",
  success: "paid",
  expire: "expired",
  deny: "failed",
  refund: "refunded",
  partial_refund: "refunded",
};

export function mapGatewayStatus(status: GatewayStatus): PaymentStatus {
  return GATEWAY_STATUS_MAP[status] ?? "pending";
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-purple-100 text-purple-700",
    expired: "bg-gray-100 text-gray-700",
  };
  return colors[status];
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    pending: "Menunggu",
    processing: "Diproses",
    paid: "Lunas",
    failed: "Gagal",
    refunded: "Dikembalikan",
    expired: "Kedaluwarsa",
  };
  return labels[status];
}
