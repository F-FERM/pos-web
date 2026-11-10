export interface ListPaymentTermsResponse {
  success: boolean;
  message: string;
  data: PaymentTerms[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentTerms {
  _id: string;
  name: string;
  type: string;
  numberOfDays: null | number;
  isSystemGenerated: boolean;
  isActive: boolean;
}