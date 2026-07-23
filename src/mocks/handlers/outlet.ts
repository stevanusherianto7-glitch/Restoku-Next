import { http, HttpResponse } from "msw";
import { mockOutlets, mockDashboardStats, mockTables, mockOrders } from "../data/mockData";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const outletHandlers = [
  http.get(`${API_BASE}/outlets`, () => {
    return HttpResponse.json({
      success: true,
      data: mockOutlets,
    });
  }),

  http.get(`${API_BASE}/outlets/:id`, ({ params }) => {
    const outlet = mockOutlets.find((o) => o.id === params.id);
    if (!outlet) {
      return HttpResponse.json(
        { success: false, message: "Outlet not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: outlet });
  }),
];

export const dashboardHandlers = [
  http.get(`${API_BASE}/dashboard/stats`, ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "today";
    const stats = mockDashboardStats[period as keyof typeof mockDashboardStats] || mockDashboardStats.today;
    return HttpResponse.json({ success: true, data: stats });
  }),

  http.get(`${API_BASE}/dashboard/revenue-chart`, ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "week";
    const labels = period === "week"
      ? ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
      : ["W1", "W2", "W3", "W4"];
    const data = labels.map(() => Math.floor(Math.random() * 5000000) + 1000000);
    return HttpResponse.json({ success: true, data: { labels, data } });
  }),
];

export const tableHandlers = [
  http.get(`${API_BASE}/tables`, () => {
    return HttpResponse.json({ success: true, data: mockTables });
  }),

  http.get(`${API_BASE}/tables/:id`, ({ params }) => {
    const table = mockTables.find((t) => t.id === params.id);
    if (!table) {
      return HttpResponse.json(
        { success: false, message: "Table not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: table });
  }),
];

export const orderHandlers = [
  http.get(`${API_BASE}/orders`, () => {
    return HttpResponse.json({ success: true, data: mockOrders });
  }),

  http.post(`${API_BASE}/orders`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newOrder = {
      id: `order-${Date.now()}`,
      ...body,
      status: "pending",
      payment_status: "unpaid",
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: newOrder }, { status: 201 });
  }),

  http.put(`${API_BASE}/orders/:id/status`, async ({ params, request }) => {
    const body = (await request.json()) as { status: string };
    return HttpResponse.json({
      success: true,
      data: { id: params.id, status: body.status },
    });
  }),
];
