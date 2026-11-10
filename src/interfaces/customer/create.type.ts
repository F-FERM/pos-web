export interface AddCustomerPayload {
  name: string;
  phone: string;
  email: string;
  address: string;
  creditLimit: number;
  balanceDue: number;
  loyaltyPoints: number;
  tag: string;
  isActive: boolean;
}
