"use client";


import PageHeader from "@/src/components/common/PageHeader";
import SearchBar from "@/src/components/common/PosSearchBar";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Barcode, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import inventoryIcon from "../../../public/icons/product-inventory.png";
import { AddProductDialog, ProductFormData } from "./AddProductInventoryDialogue";
import AddProduct from "./AddProductInventory";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";

type Product = {
  id: string;
  barcode: string;
  name: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number; 
  unit: string;
  supplier: string;
  expiryDate?: string; 
};

// Dummy data (replace with API data later)
const PRODUCTS: Product[] = [
  { id: "1", barcode: "8901030001", name: "Fortune Sunlight Sunflower Oil 1L", category: "Oil & Ghee", costPrice: 98, sellPrice: 109, stock: 45, minStock: 10, unit: "Pac", supplier: "Adani Wilmar", expiryDate: "2027-03-15" },
  { id: "2", barcode: "8901030002", name: "Aashirvaad Shudh Chakki Atta", category: "Grains & Atta", costPrice: 262, sellPrice: 285, stock: 6, minStock: 10, unit: "Bag", supplier: "ITC Foods", expiryDate: "2027-01-10" },
  { id: "3", barcode: "8901030003", name: "Tata Salt Vacuum 1 kg", category: "Spices & Salt", costPrice: 24, sellPrice: 28, stock: 120, minStock: 30, unit: "Pac", supplier: "Tata Consumer" },
  { id: "4", barcode: "8901030004", name: "Royal Sona Masoori Rice", category: "Rice & Pulses", costPrice: 340, sellPrice: 380, stock: 0, minStock: 5, unit: "Bag", supplier: "Royal Traders" },
  { id: "5", barcode: "8901030005", name: "Toor Dal Premium 1kg", category: "Rice & Pulses", costPrice: 96, sellPrice: 109, stock: 25, minStock: 8, unit: "Kg", supplier: "Royal Traders", expiryDate: "2026-10-22" },
  { id: "6", barcode: "8901030006", name: "Tata Tea Premium 250", category: "Beverages", costPrice: 118, sellPrice: 135, stock: 50, minStock: 12, unit: "Pac", supplier: "Tata Consumer", expiryDate: "2027-06-01" },
  { id: "7", barcode: "8901030007", name: "Amul Butter 100g", category: "Diary & Bakers", costPrice: 50, sellPrice: 58, stock: 4, minStock: 10, unit: "Pac", supplier: "Amul Dairy", expiryDate: "2026-10-18" },
  { id: "8", barcode: "8901030008", name: "Surf Excel Easy Wash", category: "Households", costPrice: 125, sellPrice: 142, stock: 0, minStock: 6, unit: "Pac", supplier: "HUL Distributors" },
];

type StatusFilter = "all" | "low" | "out" | "expiring";

const CURRENCY = "₹";
const EXPIRY_WINDOW_DAYS = 30;

const isOut = (p: Product) => p.stock <= 0;
const isLow = (p: Product) => p.stock > 0 && p.stock <= p.minStock;
const isExpiringSoon = (p: Product) => {
  if (!p.expiryDate) return false;
  const days = (new Date(p.expiryDate).getTime() - Date.now()) / 86_400_000;
  return days <= EXPIRY_WINDOW_DAYS; // includes already expired
};

// table row -> values shown in the edit dialog
const toFormData = (p: Product): ProductFormData => ({
  productName: p.name,
  category: p.category,
  unitType: p.unit,
  barcode: p.barcode,
  purchasePrice: String(p.costPrice),
  sellingPrice: String(p.sellPrice),
  stockQty: String(p.stock),
  supplierName: p.supplier,
  expiryDate: p.expiryDate ?? "",
});

// margin on selling price, 1 decimal
const margin = (p: Product) =>
  p.sellPrice > 0 ? Math.round(((p.sellPrice - p.costPrice) / p.sellPrice) * 1000) / 10 : 0;

function ProductInventoryPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [addOpen, setAddOpen] = useState(false);

  // delete confirmation
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isConfirmDialogOpen = !!productToDelete;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const statusOk =
        status === "all" ||
        (status === "low" && isLow(p)) ||
        (status === "out" && isOut(p)) ||
        (status === "expiring" && isExpiringSoon(p));

      return (
        statusOk &&
        (category === "All" || p.category === category) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          p.supplier.toLowerCase().includes(q))
      );
    });
  }, [products, status, category, query]);

  // called by the dialog when it closes (Cancel, overlay click, Escape)
  const handleConfirmDialogClose = (open: boolean) => {
    if (!open && !isPending) setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setIsPending(true);
      // TODO: await your delete-product API call here
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <PageHeader
        title="Product & Inventory"
        subtitle="Manage products, stock levels, pricing and suppliers"
        icon={inventoryIcon}
        actions={[
          {
            label: "Add New Product",
            icon: <Plus />,
            onClick: () => setAddOpen(true),
          },
        ]}
      />

      {/* Search + status tabs + category tabs */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar
            icon={Search}
            placeholder="Search"
            value={query}
            onSearch={setQuery}
            className="w-full max-w-none lg:w-[360px] lg:flex-none"
          />

          {/* Status tabs (wrap when there is not enough space) */}
          <Tabs value={status} onValueChange={(v) => setStatus(v as StatusFilter)} className="min-w-0">
            <TabsList
              variant="pills"
              className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0 lg:justify-end"
            >
              <TabsTrigger variant="filter" value="all" count={products.length}>All Items</TabsTrigger>
              <TabsTrigger variant="filterBlue" value="low">Low Stock</TabsTrigger>
              <TabsTrigger variant="filterGreen" value="out">Out Of Stock</TabsTrigger>
              <TabsTrigger variant="filterPurple" value="expiring">Expiring Soon</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Category tabs (one row, swipe sideways) */}
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 font-poppins text-[12px] font-normal uppercase leading-[100%] text-[#848484]">
            Category:
          </span>

          <Tabs value={category} onValueChange={setCategory} className="min-w-0 flex-1">
            <TabsList
              variant="pills"
              className="h-auto flex-nowrap justify-start gap-2 overflow-x-auto bg-transparent p-0 pb-1 [scrollbar-width:thin] [&>*]:shrink-0"
            >
              <TabsTrigger variant="category" value="All">All</TabsTrigger>
              <TabsTrigger variant="category" value="Oil & Ghee">Oil & Ghee</TabsTrigger>
              <TabsTrigger variant="category" value="Grains & Atta">Grains & Atta</TabsTrigger>
              <TabsTrigger variant="category" value="Spices & Salt">Spices & Salt</TabsTrigger>
              <TabsTrigger variant="category" value="Rice & Pulses">Rice & Pulses</TabsTrigger>
              <TabsTrigger variant="category" value="Beverages">Beverages</TabsTrigger>
              <TabsTrigger variant="category" value="Diary & Bakers">Diary & Bakers</TabsTrigger>
              <TabsTrigger variant="category" value="Households">Households</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Table (scrolls sideways on small screens) */}
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>ID/Barcode</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Sell Price</TableHead>
            <TableHead>Margin%</TableHead>
            <TableHead>In Stock</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableEmpty colSpan={9}>No products found</TableEmpty>
          ) : (
            filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.barcode}</TableCell>
                <TableCell className="max-w-[220px] truncate" title={p.name}>
                  {p.name}
                </TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{CURRENCY} {p.costPrice}</TableCell>
                <TableCell>{CURRENCY} {p.sellPrice}</TableCell>
                <TableCell>{margin(p)}%</TableCell>
                <TableCell>
                  {isOut(p) ? (
                    <span className="text-red-600">Out of stock</span>
                  ) : (
                    <span className={isLow(p) ? "text-amber-600" : undefined}>
                      {p.stock} {p.unit}
                    </span>
                  )}
                </TableCell>
                <TableCell>{p.supplier}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button type="button" aria-label="View" variant={"viewicon"}>
                      <Barcode className="size-4" />
                    </Button>
                    <AddProduct isEdit id={p.id} product={toFormData(p)} />
                    <Button
                      type="button"
                      aria-label="Delete"
                      variant={"deleteicon"}
                      onClick={() => setProductToDelete(p)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AddProductDialog open={addOpen} onOpenChange={setAddOpen} />

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete product "${productToDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}

export default ProductInventoryPage;