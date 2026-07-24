import { authHandlers } from "./auth";
import { menuHandlers } from "./menu";
import { outletHandlers, dashboardHandlers, tableHandlers, orderHandlers } from "./outlet";
import { paymentHandlers } from "./payment";
import { inventoryHandlers } from "./inventory";
import { suppliersHandlers } from "./suppliers";
import { stockOpnameHandlers } from "./stockOpname";
import { inventoryDashboardHandlers } from "./inventoryDashboard";
import { outletComparisonHandlers } from "./outletComparison";
import { cashFlowHandlers } from "./cashflow";
import { profitLossHandlers } from "./profitloss";
import { expensesHandlers } from "./expenses";
import { outletSettingsHandlers } from "./outletSettings";
import { discountHandlers } from "./discounts";
import { printerHandlers } from "./printer";
import { ttsHandlers } from "./tts";
import { employeesHandlers } from "./employees";
import { inventoryAlertsHandlers } from "./inventoryAlerts";
import { reviewsHandlers } from "./reviews";
import { ownerSettingsHandlers } from "./ownerSettings";

export const handlers = [
  ...authHandlers,
  ...menuHandlers,
  ...outletHandlers,
  ...dashboardHandlers,
  ...tableHandlers,
  ...orderHandlers,
  ...paymentHandlers,
  ...inventoryHandlers,
  ...suppliersHandlers,
  ...stockOpnameHandlers,
  ...inventoryDashboardHandlers,
  ...outletComparisonHandlers,
  ...cashFlowHandlers,
  ...profitLossHandlers,
  ...expensesHandlers,
  ...outletSettingsHandlers,
  ...discountHandlers,
  ...printerHandlers,
  ...ttsHandlers,
  ...employeesHandlers,
  ...inventoryAlertsHandlers,
  ...reviewsHandlers,
  ...ownerSettingsHandlers,
];
