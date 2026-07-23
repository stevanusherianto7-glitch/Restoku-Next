import type { RestaurantTable, TableId } from "@features/tables/domain/entities/RestaurantTable";

export interface TableRepository {
  findAll(restaurantId: string): Promise<RestaurantTable[]>;

  findById(id: TableId): Promise<RestaurantTable | null>;

  create(
    data: Omit<RestaurantTable, "id" | "qr_url" | "created_at" | "updated_at">
  ): Promise<RestaurantTable>;

  update(
    id: TableId,
    data: Partial<Omit<RestaurantTable, "id" | "created_at" | "updated_at">>
  ): Promise<RestaurantTable>;

  delete(id: TableId): Promise<void>;

  generateQr(tableIds: TableId[]): Promise<{ tableId: TableId; qrUrl: string }[]>;
}
