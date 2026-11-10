export interface ListPrivilegByIdResponse {
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
  description: string;
  roles: string[];
  isSystemGenerated: boolean;
  companyId: CompanyId;
  modules: string[];
  subModulePermissions: SubModulePermission[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SubModulePermission {
  subModuleId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  _id: string;
}

interface CompanyId {
  _id: string;
  name: string;
}