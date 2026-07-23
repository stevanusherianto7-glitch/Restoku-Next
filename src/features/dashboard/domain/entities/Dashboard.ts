export interface DashboardStats {
  today_sales: number;
  today_orders: number;
  active_orders: number;
  pending_orders: number;
  low_stock_count: number;
  sales_change: number;
  orders_change: number;
}

export interface RecentOrder {
  id: string;
  table_number: number;
  items_count: number;
  total: number;
  status: "pending" | "confirmed" | "cooking" | "ready" | "served" | "completed" | "cancelled";
  created_at: string;
}

export interface TopMenuItem {
  id: string;
  name: string;
  quantity_sold: number;
  revenue: number;
}

export interface HourlySales {
  hour: string;
  sales: number;
  orders: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_orders: RecentOrder[];
  top_menus: TopMenuItem[];
  hourly_sales: HourlySales[];
}
