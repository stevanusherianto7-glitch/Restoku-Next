export type ReportPeriod = "daily" | "weekly" | "monthly";

export interface SalesReport {
  period: ReportPeriod;
  start_date: string;
  end_date: string;
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  sales_by_category: CategorySales[];
  sales_by_hour: HourlySales[];
  top_menus: TopMenuItem[];
  daily_sales: DailySales[];
}

export interface CategorySales {
  category: string;
  sales: number;
  orders: number;
  percentage: number;
}

export interface HourlySales {
  hour: string;
  sales: number;
  orders: number;
}

export interface TopMenuItem {
  id: string;
  name: string;
  quantity_sold: number;
  revenue: number;
}

export interface DailySales {
  date: string;
  sales: number;
  orders: number;
}

export interface MenuAnalytics {
  total_views: number;
  total_orders: number;
  conversion_rate: number;
  popular_menus: TopMenuItem[];
  orders_by_table: TableOrders[];
}

export interface TableOrders {
  table_number: number;
  orders_count: number;
  total_sales: number;
}
