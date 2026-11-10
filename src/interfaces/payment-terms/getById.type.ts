export interface ListPaymentTermByIdResponse {
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
  createdBy: null;
  companyId: null;
  name: string;
  type: string;
  numberOfDays: null;
  isSystemGenerated: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}