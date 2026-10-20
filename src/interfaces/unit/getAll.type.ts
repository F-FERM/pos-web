export interface ListUnitResponse {
  success: boolean;
  message: string;
  data: Data;
  statusCode: number;
}

interface Data {
  units: Unit[];
  pagination: Pagination;
}

interface Pagination {
  currentPage: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

interface Unit {
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: null;
  createdBy: string;
  name: string;
  symbol: string;
  companyId: string;
  isActive: boolean;
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}