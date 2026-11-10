export interface AddPrivilegePayload {
  name: string;
  description: string;
  modules: string[];
  permissions: Permission[];
}

export interface Permission {
  subModuleId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}