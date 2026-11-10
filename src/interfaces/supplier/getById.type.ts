export interface ListSupplierByIdResponse {
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
  contactPerson: string;
  phone: string;
  email: string;
  taxPercentage: number;
  address: string;
  balanceDue: number;
  gstinNumber: string;
  paymentTermsId: PaymentTermsId;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaymentTermsId {
  _id: string;
  name: string;
  type: string;
  numberOfDays: null;
}