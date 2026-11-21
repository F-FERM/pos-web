export interface ListProductByIdResponse {
  success: boolean;
  message: string;
  data: Data;
  statusCode: number;
}

interface Data {
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
  expiryTracking: ExpiryTracking;
  advancedInfo: AdvancedInfo;
  isWeighted: boolean;
  scaleUnit: string;
  tareWeight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AdvancedInfo {
  serialNumber: string;
  warrantyPeriod: string;
  returnPeriod: string;
  availableAtPos: boolean;
  internalNotes: string;
}

interface ExpiryTracking {
  enableExpiryTracking: boolean;
  batches: Batch[];
  expiryAlertBefore: string;
  blockExpiredSales: boolean;
}

interface Batch {
  batchNumber: string;
  expiryDate: string;
  batchQty: number;
}

interface InventoryManagement {
  enableStockTracking: boolean;
  openingStock: number;
  lowStockAlert: number;
  reorderQuantity: number;
  allowSellingWhenOutOfStock: boolean;
  description: string;
}

interface PricingAndTax {
  purchasePrice: number;
  sellingPrice: number;
  vatRate: number;
  mrp: number;
  profitMargin: number;
  sellingPriceBeforeVat: number;
  vatAmount: number;
  priceIncludingVat: number;
}

interface BasicInfo {
  name: string;
  aliasName: string;
  image: string;
  sku: string;
  barcode: string;
  categoryId: CategoryId;
  subCategoryId: CategoryId;
  brandId: BrandId;
  unitId: UnitId;
  supplierId: SupplierId;
  description: string;
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