export interface Discount {
  id: string;
  name: string;
  type: "percent" | "nominal";
  value: number;
  appliesTo: string;
}

export interface Tax {
  id: string;
  name: string;
  rate: number;
}
