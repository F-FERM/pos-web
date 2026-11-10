export interface AddSupplierPayload {
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  taxPercentage?: string;
  address?: string;
  balanceDue?: number;
  gstinNumber?: string;
  paymentTermsId: string;
  isActive?: boolean;
}