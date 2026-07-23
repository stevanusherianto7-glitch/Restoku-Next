import { http, HttpResponse } from "msw";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const paymentHandlers = [
  // POST /payments/create
  http.post(`${API_BASE}/payments/create`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        transaction_id: `trx-${crypto.randomUUID().slice(0, 8)}`,
        redirect_url: body.amount === 0 ? undefined : "https://payment-simulator.test/checkout",
        status: "pending",
        order_id: body.orderId,
      },
    });
  }),

  // GET /payments/status/:orderId
  http.get(`${API_BASE}/payments/status/:orderId`, async ({ params }) => {
    const { orderId } = params;

    return HttpResponse.json({
      success: true,
      data: {
        id: `pay-${crypto.randomUUID().slice(0, 8)}`,
        orderId: String(orderId),
        tenantId: "tenant-1",
        gatewayTransactionId: `gtx-${crypto.randomUUID().slice(0, 8)}`,
        status: "paid",
        amount: 50000,
        paymentMethod: "qris",
        idempotencyKey: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
      },
    });
  }),

  // POST /payments/refund/:orderId
  http.post(`${API_BASE}/payments/refund/:orderId`, async () => {
    return HttpResponse.json({
      success: true,
      message: "Refund processed successfully",
    });
  }),

  // POST /webhooks/payment (external, no API_BASE prefix)
  http.post("*/api/webhooks/payment", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const signature = request.headers.get("X-Callback-Token");

    if (!signature) {
      return HttpResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const validStatuses = ["settlement", "success", "expire", "deny"];
    const gatewayStatus = String(body.status ?? "");

    if (validStatuses.includes(gatewayStatus) && gatewayStatus !== "deny") {
      return HttpResponse.json({
        status: "ok",
        data: { order_id: body.order_id, payment_status: "paid" },
      });
    }

    return HttpResponse.json({
      status: "ok",
      data: { order_id: body.order_id, payment_status: gatewayStatus },
    });
  }),

  // POST /orders/void
  http.post(`${API_BASE}/orders/void`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const { order_id, reason } = body;

    if (!order_id || !reason) {
      return HttpResponse.json(
        { success: false, error: { message: "Missing order_id or reason" } },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: "Order voided successfully",
      data: {
        order_id,
        wastage_recorded: true,
      },
    });
  }),
];
