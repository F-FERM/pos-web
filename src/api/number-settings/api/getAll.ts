import { ListNumberSettingsResponse } from "@/src/interfaces/number-settings/getAll.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const ListNumberSettingsApi = async (DocumentType: string) => {
  try {
    const response = await axiosInstance.get<ListNumberSettingsResponse>(
      `/number-settings/doc-type/${DocumentType}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data;

      const normalizedError = new Error(apiError?.error);

      (normalizedError as any).statusCode = apiError?.statusCode;
      (normalizedError as any).raw = apiError;

      throw normalizedError;
    }
    throw error;
  }
};
