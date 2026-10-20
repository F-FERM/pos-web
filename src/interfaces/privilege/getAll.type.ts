export interface ListPrivilegeResponse {
  success: boolean;
  message: string;
  data: Privilege[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Privilege {
  _id: string;
  name: string;
  description: string;
  roles: string[];
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}