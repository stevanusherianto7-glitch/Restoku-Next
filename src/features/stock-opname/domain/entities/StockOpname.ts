export interface StockOpname {
  id: string;
  date: string;
  itemId: string;
  itemName: string;
  systemStock: number;
  physicalStock: number;
  difference: number;
  note: string;
}
