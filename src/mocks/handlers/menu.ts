import { http, HttpResponse } from "msw";
import { mockMenuItems } from "../data/mockData";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const menuHandlers = [
  http.get(`${API_BASE}/menus`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");
    const isPopular = url.searchParams.get("is_popular");
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(url.searchParams.get("per_page") || "20");

    let filtered = [...mockMenuItems];

    if (search) {
      filtered = filtered.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter((m) => m.category === category);
    }
    if (status) {
      filtered = filtered.filter((m) => m.status === status);
    }
    if (isPopular !== null) {
      filtered = filtered.filter((m) => m.is_popular === (isPopular === "true"));
    }

    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    return HttpResponse.json({
      success: true,
      data: paginated,
      meta: {
        current_page: page,
        per_page: perPage,
        total: filtered.length,
        total_pages: Math.ceil(filtered.length / perPage),
      },
    });
  }),

  http.get(`${API_BASE}/menus/:id`, ({ params }) => {
    const menu = mockMenuItems.find((m) => m.id === params.id);
    if (!menu) {
      return HttpResponse.json(
        { success: false, message: "Menu not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: menu });
  }),

  http.post(`${API_BASE}/menus`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newMenu = {
      id: `menu-${Date.now()}`,
      name: (body.name as string) || "Menu Baru",
      description: (body.description as string) || "",
      price: Number(body.price) || 0,
      category_id: (body.category_id as string) || "cat-makanan",
      category: (body.category as string) || "makanan",
      image_url: (body.image_url as string) || "Nasi_Goreng_Jawa_mqtalj",
      status: (body.status as string) || "active",
      is_popular: Boolean(body.is_popular),
      is_new: Boolean(body.is_new),
      is_promo: Boolean(body.is_promo),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockMenuItems.unshift(newMenu as any);
    return HttpResponse.json({ success: true, data: newMenu }, { status: 201 });
  }),

  http.put(`${API_BASE}/menus/:id`, async ({ params, request }) => {
    const index = mockMenuItems.findIndex((m) => m.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { success: false, message: "Menu not found" },
        { status: 404 }
      );
    }
    const body = (await request.json()) as Record<string, unknown>;
    const updated = {
      ...mockMenuItems[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    mockMenuItems[index] = updated as any;
    return HttpResponse.json({
      success: true,
      data: updated,
    });
  }),

  http.delete(`${API_BASE}/menus/:id`, ({ params }) => {
    const index = mockMenuItems.findIndex((m) => m.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { success: false, message: "Menu not found" },
        { status: 404 }
      );
    }
    mockMenuItems.splice(index, 1);
    return HttpResponse.json({ success: true, message: "Menu deleted" });
  }),

  http.get(`${API_BASE}/public/menu/:restaurantId`, ({ params }) => {
    const activeMenus = mockMenuItems.filter((m) => m.status === "active");
    return HttpResponse.json({
      success: true,
      data: {
        restaurant: {
          id: (params.restaurantId as string) || "rest-1",
          name: "Restoku Central Kuliner",
          logo_url: null,
        },
        menus: activeMenus,
      },
    });
  }),
  http.get(`${API_BASE}/public/menus/:restaurantId`, ({ params }) => {
    const activeMenus = mockMenuItems.filter((m) => m.status === "active");
    return HttpResponse.json({
      success: true,
      data: {
        restaurant: {
          id: (params.restaurantId as string) || "rest-1",
          name: "Restoku Central Kuliner",
          logo_url: null,
        },
        menus: activeMenus,
      },
    });
  }),
];
