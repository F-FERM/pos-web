import { StaticImageData } from "next/image";
import Dashboard from "../../../public/icons/dashboard.png"
import Sale from "../../../public/icons/sale.png"
import Inventory from "../../../public/icons/inventory.png"
import Purchases from "../../../public/icons/purchases.png"
import { ChartLine, LayoutDashboard, LucideIcon, Package, ReceiptText, Settings, ShoppingCart } from "lucide-react";
export const ROLES = [
  "Administrator",
  "Store Manager",
  "Cashier",
  "Accountant",
  "Inventory Staff",
] as const;
export type Role = (typeof ROLES)[number];

export interface PermissionGroup {
  id: string;
  title: string;
 icon: LucideIcon;
  permissions: { id: string; label: string }[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    permissions: [
      { id: "dashboard.view", label: "View Dashboard" },
      { id: "dashboard.sales", label: "View Sales Summary" },
      { id: "dashboard.profit", label: "View Profit Summary" },
    ],
  },
  {
    id: "sales",
    title: "Sales & Billing",
    icon: ReceiptText,
    permissions: [
      { id: "sales.view", label: "View Sales" },
      { id: "sales.create", label: "Create Bill" },
      { id: "sales.edit", label: "Edit Bill" },
      { id: "sales.delete", label: "Delete Bill" },
      { id: "sales.discount", label: "Apply Discount" },
    ],
  },
  {
    id: "inventory",
    title: "Inventory",
    icon: Package,
    permissions: [
      { id: "inventory.view", label: "View Products" },
      { id: "inventory.create", label: "Add Product" },
      { id: "inventory.edit", label: "Edit Product" },
      { id: "inventory.delete", label: "Delete Product" },
      { id: "inventory.stock", label: "Adjust Stock" },
    ],
  },
  {
    id: "purchases",
    title: "Purchases",
    icon: ShoppingCart,
    permissions: [
      { id: "purchases.view", label: "View Purchases" },
      { id: "purchases.create", label: "Create Purchase" },
      { id: "purchases.delete", label: "Delete Purchase" },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    icon: ChartLine,
    permissions: [
      { id: "reports.sales", label: "Sales Report" },
      { id: "reports.stock", label: "Stock Report" },
      { id: "reports.profit", label: "Profit Report" },
      { id: "reports.export", label: "Export Reports" },
    ],
  },
  {
    id: "settings",
    title: "Settings & Users",
    icon: Settings,
    permissions: [
      { id: "settings.view", label: "View Settings" },
      { id: "settings.edit", label: "Edit Settings" },
      { id: "users.view", label: "View Users" },
      { id: "users.manage", label: "Manage Users" },
    ],
  },
];

export const ALL_PERMISSION_IDS = PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.id),
);