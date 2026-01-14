
export interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  revenue: number;
}

export interface InventoryItem {
  id: string;
  branchId: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
}

export interface Sale {
  id: string;
  branchId: string;
  timestamp: string;
  total: number;
  items: string[];
}

export interface Staff {
  id: string;
  branchId: string;
  name: string;
  role: 'Manager' | 'Cashier' | 'Stock' | 'Admin';
  phone: string;
}

export type ViewType = 'Dashboard' | 'Branches' | 'Inventory' | 'Sales' | 'Staff' | 'AI-Insights' | 'Database';
