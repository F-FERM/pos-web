export interface ListProductResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Product {
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: null;
  syncVersion: number;
  lastSyncedAt: null;
  createdBy: string;
  companyId: string;
  basicInfo: BasicInfo;
  pricingAndTax: PricingAndTax;
  inventoryManagement: InventoryManagement;
  isWeighted: boolean;
  scaleUnit: string;
  tareWeight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface InventoryManagement {
  enableStockTracking: boolean;
  openingStock: number;
  lowStockAlert: number;
  description: string;
}

interface PricingAndTax {
  purchasePrice: number;
  sellingPrice: number;
  vatRate: number;
  profitMargin: number;
  sellingPriceBeforeVat: number;
  vatAmount: number;
  priceIncludingVat: number;
}

interface BasicInfo {
  name: string;
  image: string;
  sku: string;
  barcode: string;
  categoryId: CategoryId;
  brandId: BrandId;
  unitId: UnitId;
  supplierId: SupplierId;
}

interface SupplierId {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
}

interface UnitId {
  _id: string;
  name: string;
  symbol: string;
}

interface BrandId {
  _id: string;
  name: string;
}

interface CategoryId {
  _id: string;
  name: string;
  code: string;
}
