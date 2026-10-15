import { UpdateCompanyPayload } from "@/src/interfaces/company/update.type";

export const buildCompanyFormData = (
  payload: UpdateCompanyPayload
): FormData => {
  const formData = new FormData();

  const { logo, ...companyData } = payload;

  Object.entries(companyData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  if (logo instanceof File) {
    formData.append("logo", logo);
  }

  return formData;
};