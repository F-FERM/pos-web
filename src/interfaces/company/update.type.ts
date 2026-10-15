export interface UpdateCompanyPayload {
  name?: string;
  logo?: File | null;
  contact?:Contact;
  address?:Address;
  taxIdentifiers?:TaxIdentifiers;
  regional?:Regional;
}

interface Regional {
  currency?: string;
  currencySymbol?: string;
}

interface TaxIdentifiers {
  vatNumber?: string;
}

interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface Contact {
  primaryEmail?: string;
  primaryPhone?: string;
  alternatePhone?: string;
  website?: string;
}