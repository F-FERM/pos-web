export interface ListPrinterResponse {
  success: boolean;
  message: string;
  data: Printer[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Printer {
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: null;
  createdBy: CreatedBy;
  printerName: string;
  printerIp: string;
  counterId: CounterId;
  paperWidth: string;
  isDefault: boolean;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CounterId {
  _id: string;
  name: string;
  code: string;
}

interface CreatedBy {
  _id: string;
  username: string;
  name: string;
}