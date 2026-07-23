import { authHandlers } from "./auth";
import { menuHandlers } from "./menu";
import { outletHandlers, dashboardHandlers, tableHandlers, orderHandlers } from "./outlet";
import { paymentHandlers } from "./payment";

export const handlers = [
  ...authHandlers,
  ...menuHandlers,
  ...outletHandlers,
  ...dashboardHandlers,
  ...tableHandlers,
  ...orderHandlers,
  ...paymentHandlers,
];
