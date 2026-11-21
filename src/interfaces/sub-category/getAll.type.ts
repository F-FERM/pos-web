export interface ListSubCategoryResponse {
  success: boolean;
  message: string;
  data: SubCategory[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubCategory {
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: null;
  syncVersion: number;
  lastSyncedAt: null;
  createdBy: string;
  name: string;
  code: string;
  description: string;
  categoryId: CategoryId;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CategoryId {
  _id: string;
  name: string;
  code: string;
}