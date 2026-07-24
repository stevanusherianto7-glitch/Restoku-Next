import { http, HttpResponse } from "msw";
import { delay, makeId } from "../data/seed";
import type { Supplier } from "@features/suppliers/domain/entities/Supplier";

const seedSuppliers: Supplier[] = [
  { id: "sup_0001", name: "CV Sinar Tani", contact: "Budi", phone: "0812-1111", email: "budi@sinartani.co.id", address: "Jl. Raya Bogor 12", leadTimeDays: 2 },
  { id: "sup_0002", name: "PT Sumber Fresh", contact: "Siti", phone: "0813-2222", email: "siti@sumberfresh.com", address: "Jl. Palmerah 8", leadTimeDays: 1 },
  { id: "sup_0003", name: "UD Makmur", contact: "Anton", phone: "0814-3333", email: "anton@makmur.id", address: "Jl. Ciledug 45", leadTimeDays: 3 },
];

export const suppliersHandlers = [
  http.get("/api/v1/suppliers", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: seedSuppliers });
  }),
  http.post("/api/v1/suppliers", async ({ request }) => {
    await delay();
    const body = (await request.json()) as Omit<Supplier, "id">;
    const created: Supplier = { ...body, id: makeId("sup") };
    seedSuppliers.push(created);
    return HttpResponse.json({ success: true, data: created });
  }),
];
