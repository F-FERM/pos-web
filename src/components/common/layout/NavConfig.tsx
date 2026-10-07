import {
  Barcode,
  ChartColumn,
  DollarSign,
  LayoutGrid,
  Package,
  PackagePlus,
  ReceiptText,
  RotateCcw,
  Settings,
  ShoppingCart,
  TrendingDown,
  Truck,
  UserPlus,
  Users,
} from "lucide-react";
import type { ElementType } from "react";

export const BRAND = "#B91DB5";


export type NavItem = {
  title: string;
  url: string;
  icon: ElementType;
  heading?: string; 
};

export type NavSection = { label: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Sales & POS Terminal",
    items: [
      { title: "Dashboard", url: "/pos/dashboard", icon: LayoutGrid },
      { title: "Pos Billing", url: "/pos/pos-billing", icon: ShoppingCart, heading: "SALE" },
      { title: "Cash Drawer Shifts", url: "/pos/cash-drawer", icon: DollarSign },
      { title: "Sales History", url: "/pos/sales-invoice", icon: ReceiptText },
      { title: "Returns And Refunds", url: "/pos/returns-refunds", icon: RotateCcw },
    ],
  },
  {
    label: "Inventory & Supply Chain",
    items: [
      { title: "Products Inventory", url: "/pos/product-inventory", icon: Package },
      { title: "Purchase Orders", url: "/pos/purchase-order", icon: PackagePlus },
    ],
  },
  {
    label: "CRM & Accounting",
    items: [
      { title: "Customer Dues", url: "/pos/customer-dues", icon: Users },
      { title: "Suppliers Directory", url: "/pos/supplier-directory", icon: Truck },
      { title: "Shop Expenses", url: "/pos/shop-expense", icon: TrendingDown },
      { title: "Reports & P&L", url: "/pos/reports", icon: ChartColumn },
    ],
  },
  {
    label: "Enterprise & System",
    items: [
      { title: "Staff & Security PIN", url: "/pos/staff-security", icon: UserPlus },
      { title: "Label Designer", url: "/pos/label-designer", icon: Barcode },
    ],
  },
  
];

export const SETTINGS_ITEM: NavItem = {
  title: "Settings",
  url: "/pos/settings",
  icon: Settings,
};

export const ALL_ITEMS: NavItem[] = [
  ...NAV_SECTIONS.flatMap((s) => s.items),
  SETTINGS_ITEM,
];

export const isActive = (pathname: string, url: string) =>
  pathname === url || pathname.startsWith(url + "/");