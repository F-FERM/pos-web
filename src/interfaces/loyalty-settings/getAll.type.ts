export interface ListLoyaltySettingsResponse {
  success: boolean;
  message: string;
  data: LoyaltySettings;
  statusCode: number;
}

export interface LoyaltySettings {
  isSynced: boolean;
  syncedAt: null;
  syncVersion: number;
  lastSyncedAt: null;
  _id: string;
  isDeleted: boolean;
  createdBy: string;
  companyId: string;
  loyaltyAmountPerPoint: number;
  minLoyaltyPointsToRedeem: number;
  loyaltyPointMonetaryValue: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}