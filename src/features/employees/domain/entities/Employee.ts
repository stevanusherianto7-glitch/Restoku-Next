export interface Employee {
  id: string;
  name: string;
  role: "kasir" | "kitchen" | "waiter" | "manager" | "owner";
  email: string;
  phone: string;
  pin: string;
  active: boolean;
}
