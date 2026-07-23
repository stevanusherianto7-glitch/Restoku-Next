export interface Outlet {
  id: string;
  name: string;
  address: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OutletState {
  outlets: Outlet[];
  selectedOutlet: Outlet | null;
  isLoading: boolean;
  error: string | null;
}

export type OutletAction =
  | { type: "SET_OUTLETS"; payload: Outlet[] }
  | { type: "SELECT_OUTLET"; payload: Outlet }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };
