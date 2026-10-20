export interface ListBrandResponse {
  success: boolean;
  message: string;
  data: Brand[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Brand {
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: null;
  createdBy: string;
  name: string;
  description: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}