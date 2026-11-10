export interface ListSupplierResponse {
  success: boolean;
  message: string;
  data: Supplier[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Supplier {
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: null;
  createdBy: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  taxPercentage: number;
  address: string;
  balanceDue: number;
  gstinNumber: string;
  paymentTermsId: PaymentTermsId;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaymentTermsId {
  _id: string;
  name: string;
  type: string;
  numberOfDays: null;
}