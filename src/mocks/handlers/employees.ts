import { http, HttpResponse } from "msw";
import { delay, makeId } from "../data/seed";
import type { Employee } from "@features/employees/domain/entities/Employee";

const seedEmployees: Employee[] = [
  { id: "emp_0001", name: "Andi", role: "kasir", email: "andi@kedai.id", phone: "0811", pin: "123456", active: true },
  { id: "emp_0002", name: "Budi", role: "kitchen", email: "budi@kedai.id", phone: "0812", pin: "111111", active: true },
  { id: "emp_0003", name: "Citra", role: "waiter", email: "citra@kedai.id", phone: "0813", pin: "654321", active: false },
  { id: "emp_0004", name: "Dewi", role: "manager", email: "dewi@kedai.id", phone: "0814", pin: "999999", active: true },
];

export const employeesHandlers = [
  http.get("/api/v1/employees", async () => {
    await delay();
    return HttpResponse.json({ success: true, data: seedEmployees });
  }),
  http.post("/api/v1/employees", async ({ request }) => {
    await delay();
    const body = (await request.json()) as Omit<Employee, "id">;
    const created: Employee = { ...body, id: makeId("emp") };
    seedEmployees.push(created);
    return HttpResponse.json({ success: true, data: created });
  }),
];
