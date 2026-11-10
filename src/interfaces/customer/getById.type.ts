
export interface ListCustomerByIdResponse {
  success: boolean;
  message: string;
  data: Data;
  statusCode: number;
}

interface Data {
  tag: string;
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: null;
  createdBy: CreatedBy;
  name: string;
  phone: string;
  email: string;
  address: string;
  creditLimit: number;
  balanceDue: number;
  loyaltyPoints: number;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  purchaseHistory: any[];
  totalPurchases: number;
  totalSpent: number;
}

interface CreatedBy {
  _id: string;
  username: string;
  name: string;
}