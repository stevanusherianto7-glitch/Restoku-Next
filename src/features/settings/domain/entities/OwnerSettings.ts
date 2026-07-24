export interface OwnerSettings {
  tenantName: string;
  ownerName: string;
  email: string;
  phone: string;
  subscriptionPlan: "trial" | "basic" | "pro" | "enterprise";
  logoPublicId?: string;
}
