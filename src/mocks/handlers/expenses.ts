import { http, HttpResponse } from "msw";
import { delay, makeId } from "../data/seed";
import type { Expense } from "@features/finance/domain/entities/Expense";

const seedExpenses: Expense[] = [
  { id: "exp_0001", date: "2026-07-22", category: "Gaji", amount: 1200000, note: "Kasir" },
  { id: "exp_0002", date: "2026-07-23", category: "Bahan", amount: 900000, note: "Sayur" },
  { id: "exp_0003", date: "2026-07-23", category: "Utilitas", amount: 350000, note: "Listrik" },
  { id: "exp_0004", date: "2026-07-24", category: "Sewa", amount: 5000000, note: "Outlet" },
];

export const expensesHandlers = [
  http.get("/api/v1/expenses", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: seedExpenses });
  }),
  http.post("/api/v1/expenses", async ({ request }) => {
    await delay();
    const body = (await request.json()) as Omit<Expense, "id">;
    const created: Expense = { ...body, id: makeId("exp") };
    seedExpenses.push(created);
    return HttpResponse.json({ success: true, data: created });
  }),
];
