"use client";

import PageHeader from "@/src/components/common/PageHeader";
import SearchBar from "@/src/components/common/PosSearchBar";
import { Button } from "@/src/components/ui/button";
import {
  Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Barcode, Plus, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import inventoryIcon from "../../../public/icons/product-inventory.png";
import { AddProductDialog } from "./AddProductInventoryDialogue";
import AddProduct from "./AddProductInventory";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import { PaginationComponent } from "../common/PaginationComponent";
import ErrorHandling from "../Error/ErrorHandling";
import { ListProductApi } from "@/src/api/product/api/getAll";
import { useDeleteProduct } from "@/src/api/product/hooks/delete.hook";
import { ListCategoryApi } from "@/src/api/category/api/getAll";
import { Product } from "@/src/interfaces/product/getAll.type";
import ProductTableSkeleton from "./ProductInventorySkeletonLoading";

type StatusFilter = "all" | "low" | "out" | "expiring";

const CURRENCY = " ⃃";

const stockOf = (p: Product) => p.inventoryManagement?.openingStock ?? 0;
const isOut = (p: Product) => stockOf(p) <= 0;
const isLow = (p: Product) =>
  stockOf(p) > 0 && stockOf(p) <= (p.inventoryManagement?.lowStockAlert ?? 0);

// "15 Days" -> 15
const alertDays = (v?: string) => parseInt(v ?? "", 10) || 0;

// expiring soon = expiry tracking is on and any batch expires within the alert window (or already expired)
const isExpiring = (p: Product) => {
  const e = p.expiryTracking;
  if (!e?.enableExpiryTracking || !e.batches?.length) return false;
  const limit = Date.now() + alertDays(e.expiryAlertBefore) * 24 * 60 * 60 * 1000;
  return e.batches.some((b) => b.expiryDate && new Date(b.expiryDate).getTime() <= limit);
};

function ProductInventoryPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [categoryId, setCategoryId] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // delete confirmation
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { data: categoryData } = useQuery({
    queryKey: ["categoryList"],
    queryFn: () => ListCategoryApi({ page: 1, limit: 100 }),
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["productList", currentPage, pageSize, query, categoryId],
    queryFn: () =>
      ListProductApi({
        page: currentPage,
        limit: pageSize,
        search: query,
        categoryId: categoryId,
      }),
  });

  const products = data?.data ?? [];
  const totalCount = data?.pagination?.totalCount ?? 0;

  const { mutate: DeleteProduct, isPending } = useDeleteProduct();

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          status === "all" ||
          (status === "low" && isLow(p)) ||
          (status === "out" && isOut(p)) ||
          (status === "expiring" && isExpiring(p)),
      ),
    [products, status],
  );

  const clearCategory = () => {
    setCategoryId("");
    setCurrentPage(1);
  };

  const handleConfirmDialogClose = (open: boolean) => {
    if (!open && !isPending) setProductToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    DeleteProduct(
      { id: productToDelete._id, productName: productToDelete.basicInfo.name },
      { onSuccess: () => setProductToDelete(null) },
    );
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <ErrorHandling message={error.message} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <PageHeader
        title="Product & Inventory"
        subtitle="Manage products, stock levels, pricing and suppliers"
        icon={inventoryIcon}
        actions={[{ label: "Add New Product", icon: <Plus />, onClick: () => setAddOpen(true) }]}
      />

      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5">
        {/* Search + status filters */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar
            icon={Search}
            placeholder="Search"
            value={query}
            onSearch={(v) => {
              setQuery(v);
              setCurrentPage(1);
            }}
            className="w-full max-w-none lg:w-[360px] lg:flex-none"
          />

          <Tabs
            value={status}
            onValueChange={(v) => setStatus(v as StatusFilter)}
            className="min-w-0"
          >
            <TabsList
              variant="pills"
              className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0 lg:justify-end"
            >
              <TabsTrigger variant="filter" value="all" count={totalCount}>
                All Items
              </TabsTrigger>
              <TabsTrigger variant="filterBlue" value="low">
                Low Stock
              </TabsTrigger>
              <TabsTrigger variant="filterGreen" value="out">
                Out Of Stock
              </TabsTrigger>
              <TabsTrigger variant="filterPurple" value="expiring">
                Expiring Soon
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Category filter */}
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <span className="shrink-0 font-poppins text-[12px] font-normal uppercase leading-[100%] text-[#848484]">
              Category:
            </span>

            {/* Clear button: phones (next to the label) */}
            {categoryId && (
              <button
                type="button"
                onClick={clearCategory}
                className="flex shrink-0 items-center gap-1 rounded-full border border-red-300 px-2.5 py-1 text-[11px] font-medium uppercase text-red-600 transition-colors hover:bg-red-50 sm:hidden"
              >
                <X className="size-3" />
                Clear
              </button>
            )}
          </div>

          <Tabs
            value={categoryId || "all"}
            onValueChange={(v) => {
              setCategoryId(v === "all" ? "" : v);
              setCurrentPage(1);
            }}
            className="min-w-0 flex-1"
          >
            <TabsList
              variant="pills"
              className="h-auto flex-nowrap justify-start gap-2 overflow-x-auto bg-transparent p-0 pb-1 [scrollbar-width:thin] [&>*]:shrink-0"
            >
              <TabsTrigger variant="category" value="all">
                All
              </TabsTrigger>
              {categoryData?.data.map((c) => (
                <TabsTrigger key={c._id} variant="category" value={c._id}>
                  {c.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Clear button: tablet / desktop (end of the row) */}
          {categoryId && (
            <button
              type="button"
              onClick={clearCategory}
              className="hidden shrink-0 items-center gap-1 rounded-full border border-red-300 px-3 py-1 text-[11px] font-medium uppercase text-red-600 transition-colors hover:bg-red-50 sm:flex"
            >
              <X className="size-3" />
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Table */}
      <div className="w-full overflow-x-auto">
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
            {isLoading ? (
              <ProductTableSkeleton />
            ) : filtered.length === 0 ? (
              <TableEmpty colSpan={9}>No products found</TableEmpty>
            ) : (
              filtered.map((p) => {
                const b = p.basicInfo;
                const unit = b.unitId?.symbol;
                const low = isLow(p);
                return (
                  <TableRow key={p._id}>
                    <TableCell>{b.barcode || b.sku}</TableCell>
                    <TableCell className="max-w-[220px] truncate" title={b.name}>
                      {b.name}
                    </TableCell>
                    <TableCell>
                      {typeof b.categoryId === "string" ? "-" : b.categoryId?.name ?? "-"}
                    </TableCell>
                    <TableCell>
                      {CURRENCY} {p.pricingAndTax.purchasePrice}
                    </TableCell>
                    <TableCell>
                      {CURRENCY} {p.pricingAndTax.sellingPrice}
                    </TableCell>
                    <TableCell>{p.pricingAndTax.profitMargin}%</TableCell>
                    <TableCell>
                      {isOut(p) ? (
                        <span className="font-medium text-red-600">Out of stock</span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap ${
                            low ? "font-medium text-orange-500" : ""
                          }`}
                        >
                          {stockOf(p)} {unit}
                          {low && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-orange-600">
                              Low
                            </span>
                          )}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {typeof b.supplierId === "string" ? "-" : b.supplierId?.name ?? "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button type="button" aria-label="View" variant="viewicon">
                          <Barcode className="size-4" />
                        </Button>
                        <AddProduct isEdit id={p._id} />
                        <Button
                          type="button"
                          aria-label="Delete"
                          variant="deleteicon"
                          onClick={() => setProductToDelete(p)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalItems={totalCount}
        pageSizeOptions={[5, 10, 20, 50]}
        showItemsInfo
        itemsPerPage={pageSize}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <AddProductDialog open={addOpen} onOpenChange={setAddOpen} />

      <ConfirmationDialog
        open={!!productToDelete}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete product "${productToDelete?.basicInfo.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}

export default ProductInventoryPage;