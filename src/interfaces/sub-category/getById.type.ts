export interface ListSubCategoryByIdResponse {
  success: boolean;
  message: string;
  data: Data;
  statusCode: number;
}

interface Data {
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