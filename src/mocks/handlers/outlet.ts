import { http, HttpResponse } from "msw";
import { mockOutlets, mockDashboardStats, mockTables, mockOrders } from "../data/mockData";
import type { DashboardData } from "@features/dashboard/domain/entities/Dashboard";

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
  http.get(`${API_BASE}/dashboard`, () => {
    const today = mockDashboardStats.today;
    const stats: DashboardData["stats"] = {
      today_sales: today.revenue,
      today_orders: today.orders,
      active_orders: today.orders,
      pending_orders: Math.floor(today.orders * 0.3),
      low_stock_count: 2,
      sales_change: 12.5,
      orders_change: 8.3,
    };
    const recent_orders: DashboardData["recent_orders"] = mockOrders
      .slice(0, 5)
      .map((o) => ({
        id: o.id,
        table_number: o.table_number ?? 1,
        items_count: Array.isArray(o.items) ? o.items.length : 1,
        total: o.total ?? 0,
        status: (o.status ?? "pending") as DashboardData["recent_orders"][number]["status"],
        created_at: o.created_at ?? new Date().toISOString(),
      }));
    const top_menus: DashboardData["top_menus"] = (
      today.topSellingItems ?? []
    ).map((m, idx) => ({
      id: `top-${idx + 1}`,
      name: m.name,
      quantity_sold: m.count,
      revenue: 0,
    }));
    const hourly_sales: DashboardData["hourly_sales"] = [];
    return HttpResponse.json({
      success: true,
      data: { stats, recent_orders, top_menus, hourly_sales },
    });
  }),

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
