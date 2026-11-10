export interface ListCustomerResponse {
  success: boolean;
  message: string;
  data: Customer[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Customer {
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: null;
  createdBy: CreatedBy;
  name: string;
  phone: string;
  email: string;
  address: string;
  creditLimit: number;
  balanceDue: number;
    tag: string;

  loyaltyPoints: number;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CreatedBy {
  _id: string;
  username: string;
  name: string;
}