export interface ListNumberSettingsResponse {
  success: boolean;
  message: string;
  data: Data;
}

interface Data {
  isSynced: boolean;
  syncedAt: null;
  syncVersion: number;
  lastSyncedAt: null;
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  companyId: string;
  docType: string;
  mode: string;
  prefix: string;
  nextNumber: number;
  nextNumberRaw: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}