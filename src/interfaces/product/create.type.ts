export interface AddProductPayload {
  basicInfo: BasicInfo;
  pricingAndTax: PricingAndTax;
  inventoryManagement: InventoryManagement;

  isActive: boolean;
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
  image?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  brandId?: string;
  unitId: string;
  supplierId?: string;
}
