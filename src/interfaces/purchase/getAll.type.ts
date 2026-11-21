export interface ListPurchaseResponse {
  success: boolean;
  message: string;
  data: Purchase[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Purchase {
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: null;
  syncVersion: number;
  lastSyncedAt: null;
  createdBy: CreatedBy;
  billNumber: string;
  supplierId: SupplierId;
  items: Item[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  purchaseDate: string;
  companyId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Item {
  productId: ProductId;
  productName: string;
  quantity: number;
  costPrice: number;
  totalCost: number;
}

interface ProductId {
  _id: string;
}

interface SupplierId {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
}

interface CreatedBy {
  _id: string;
  username: string;
  name: string;
}