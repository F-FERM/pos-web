export interface UpdateCompanyPayload {
  name: string;
  contact: Contact;
  address: Address;
  taxIdentifiers: TaxIdentifiers;
  regional: Regional;
  branding: Branding;
}

interface Branding {
  logoUrl?: string;
}

interface Regional {
  currency: string;
  currencySymbol: string;
}

interface TaxIdentifiers {
  vatNumber: string;
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