export interface ListCompanyResponse {
  success: boolean;
  message: string;
  data: Company[];
  pagination: Pagination;
  statusCode: number;
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Company {
  _id: string;
  isDeleted: boolean;
  isSynced: boolean;
  syncedAt: string;
  createdBy: string;
  subscriptionId: string;
  name: string;
  code: string;
  slug: string;
  licenseKey: string;
  industry: string;
  businessType: string;
  status: string;
  onboardingStep: string;
  contact: Contact;
  address: Address;
  regional: Regional;
  features: Features;
  subscription: Subscription;
  isMultiCounterAllowed: boolean;
  currentUserCount: number;
  currentCounterCount: number;
  ownerId: OwnerId;
  defaultCounterId: string;
  suspendedAt: null;
  suspendedBy: null;
  activatedAt: string;
  lastActivityAt: null;
  syncVersion: number;
  lastSyncedAt: string;
  deletedAt: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  taxIdentifiers: TaxIdentifiers;
  branding: Branding;
}

interface Branding {
  logoUrl: string;
}

interface TaxIdentifiers {
  vatNumber: string;
}

interface OwnerId {
  _id: string;
  username: string;
  name: string;
  email: string;
}

interface Subscription {
  status: string;
  startDate: string;
  endDate: string;
  trialStartDate: null;
  trialEndDate: null;
}

interface Features {
  inventoryEnabled: boolean;
  multiCounterEnabled: boolean;
  barcodeEnabled: boolean;
  weightedItemsEnabled: boolean;
  batchTrackingEnabled: boolean;
  serialTrackingEnabled: boolean;
  variantsEnabled: boolean;
  loyaltyEnabled: boolean;
  taxEnabled: boolean;
}

interface Regional {
  currency: string;
  currencySymbol: string;
  timezone: string;
  locale: string;
  dateFormat: string;
  timeFormat: string;
  fiscalYearStartMonth: number;
}

interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Contact {
  primaryEmail: string;
  primaryPhone: string;
  alternatePhone: string;
  website: string;
}