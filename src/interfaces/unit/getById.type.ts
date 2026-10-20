export interface ListUnitByIdResponse {
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
  symbol: string;
  companyId: string;
  isActive: boolean;
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}