export interface ListCategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Category {
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: null;
  createdBy: string;
  name: string;
  code: string;
  description: string;
  parentId: ParentId | null;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ParentId {
  _id: string;
  name: string;
  code: string;
}


export interface GetCategoryRequest {
    search?: string;
    page?: number;
    limit?: number;
}