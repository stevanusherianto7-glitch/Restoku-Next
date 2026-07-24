export interface CashFlowEntry {
  id: string;
  date: string;
  type: "in" | "out";
  category: string;
  amount: number;
  note: string;
}
