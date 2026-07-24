export interface PnL {
  period: string;
  revenue: number;
  cogs: number;
  opex: number;
  netProfit: number;
  marginPct: number;
  isEstimate: boolean;
}
