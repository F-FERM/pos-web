export interface AddProductPayload {
  basicInfo: BasicInfo;
  pricingAndTax: PricingAndTax;
  inventoryManagement: InventoryManagement;
  expiryTracking: ExpiryTracking;
  advancedInfo: AdvancedInfo;
  isActive: boolean;
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
  aliasName?: string;
  image?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  unitId: string;
  supplierId?: string;
  description?: string;
}