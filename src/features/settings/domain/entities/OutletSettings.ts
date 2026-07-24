export interface OutletSettings {
  outletId: string;
  name: string;
  address: string;
  phone: string;
  logoPublicId?: string;
  screenMode: "nano-banana" | "warm-cozy" | "krem" | "light" | "dark";
  qrType: "self_order" | "queue";
}
