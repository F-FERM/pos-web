export interface AddPurchasePayload {
  billNumber?: string;
  supplierId: string;
  items: Item[];
  paidAmount: number;
  purchaseDate?: string;
  notes?: string;
}

interface Item {
  productId: string;
  quantity: number;
  costPrice: number;
}