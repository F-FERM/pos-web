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


export interface ListModulesWithSubmodulesResponse {
  success: boolean;
  message: string;
  data: ModulesWithSubmodules[];
  statusCode: number;
}

export interface ModulesWithSubmodules {
  _id: string;
  isDeleted: boolean;
  createdBy: null;
  identity: string;
  label: string;
  isActive: boolean;
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  subModules: SubModule[];
}

interface SubModule {
  _id: string;
  isDeleted: boolean;
  createdBy: null;
  identity: string;
  label: string;
  moduleId: string;
  isActive: boolean;
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}