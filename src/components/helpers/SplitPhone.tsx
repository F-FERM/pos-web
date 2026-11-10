import { DEFAULT_COUNTRY_CODE } from "../customer-dues/AddCustomeDuesDialog";

export const buildPhone = (countryCode: string, phone: string) =>
  `${countryCode}${phone.replace(/\D/g, "")}`;

export const splitPhone = (full: string) => {
  const value = (full ?? "").trim();
  if (!value.startsWith("+")) {
    return { countryCode: DEFAULT_COUNTRY_CODE, phone: value };
  }
  if (value.startsWith(DEFAULT_COUNTRY_CODE)) {
    return { countryCode: DEFAULT_COUNTRY_CODE, phone: value.slice(DEFAULT_COUNTRY_CODE.length) };
  }
  const m = value.match(/^(\+\d{1,3})(\d+)$/);
  return m
    ? { countryCode: m[1], phone: m[2] }
    : { countryCode: DEFAULT_COUNTRY_CODE, phone: value };
};