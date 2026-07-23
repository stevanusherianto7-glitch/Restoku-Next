import { http, HttpResponse } from "msw";
import { mockUsers } from "../data/mockData";

export const authHandlers = [
  http.post(/\/auth\/login$/, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = Object.values(mockUsers).find((u) => u.email === body.email);

    // Demo account for e2e / manual testing without a backend.
    const isDemoAdmin = body.email === "admin@restoku.com";

    if ((!user && !isDemoAdmin) || (!body.password && !isDemoAdmin)) {
      return HttpResponse.json(
        { success: false, message: "Login gagal: email atau password salah" },
        { status: 401 }
      );
    }

    const resolvedUser = user ?? {
      id: "u-demo",
      name: "Admin Restoku",
      email: "admin@restoku.com",
      role: "owner",
      restaurantId: "r1",
      tenant_id: "t1",
      outlet_id: null,
    };

    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: resolvedUser.id,
          name: resolvedUser.name,
          email: resolvedUser.email,
          role: resolvedUser.role,
          restaurant_id: resolvedUser.restaurantId,
          tenant_id: resolvedUser.tenant_id,
          outlet_id: resolvedUser.outlet_id,
        },
        token: `mock-jwt-${resolvedUser.id}`,
        refresh_token: `mock-refresh-${resolvedUser.id}`,
      },
    });
  }),

  http.post(/\/auth\/logout$/, () => {
    return HttpResponse.json({ success: true, message: "Logged out" });
  }),

  http.post(/\/auth\/refresh$/, () => {
    return HttpResponse.json({
      success: true,
      data: { token: "mock-jwt-refreshed" },
    });
  }),

  http.get(/\/auth\/me$/, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer mock-jwt-")) {
      return HttpResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = auth.replace("mock-jwt-", "");
    const user = Object.values(mockUsers).find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurant_id: user.restaurantId,
        tenant_id: user.tenant_id,
        outlet_id: user.outlet_id,
      },
    });
  }),
];
