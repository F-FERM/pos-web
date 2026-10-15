export interface ListCategoryByIdResponse {
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
  createdBy: string;
  name: string;
  code: string;
  description: string;
  parentId: ParentId;
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