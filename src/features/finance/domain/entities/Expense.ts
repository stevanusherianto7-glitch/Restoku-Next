export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  note: string;
  employeeId?: string;
}
