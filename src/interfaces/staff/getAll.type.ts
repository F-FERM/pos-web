export interface ListStaffResponse {
  success: boolean;
  message: string;
  data: Staff[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Staff {
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