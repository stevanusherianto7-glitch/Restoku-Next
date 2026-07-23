export type RestaurantId = string & { readonly __brand: unique symbol };
export type UserId = string & { readonly __brand: unique symbol };
export type Money = number & { readonly __brand: unique symbol };

export function createRestaurantId(id: string): RestaurantId {
  return id as RestaurantId;
}

export function createUserId(id: string): UserId {
  return id as UserId;
}

export function createMoney(amount: number): Money {
  if (amount < 0) throw new Error("Money cannot be negative");
  return amount as Money;
}
