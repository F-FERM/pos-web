export interface ListCounterResponse {
  success: boolean;
  message: string;
  data: Counter[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Counter {
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: null;
  createdBy: CreatedBy;
  name: string;
  code: string;
  isDefault: boolean;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CreatedBy {
  _id: string;
  username: string;
  name: string;
}