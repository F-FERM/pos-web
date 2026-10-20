export interface ListStaffByIdResponse {
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
  createdBy: CreatedBy;
  name: string;
  phone: string;
  email: string;
  designation: string;
  pin: string;
  userId: UserId;
  privilegeId: PrivilegeId;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PrivilegeId {
  _id: string;
  name: string;
  roles: string[];
  subModulePermissions: any[];
}

interface UserId {
  _id: string;
  username: string;
  name: string;
  email: string;
}

interface CreatedBy {
  _id: string;
  username: string;
  name: string;
}