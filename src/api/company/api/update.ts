import { UpdateCompanyPayload } from "@/src/interfaces/company/update.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const editCompanyApi = async (
  id: string,
  payload: UpdateCompanyPayload
) => {
  try {
    const response = await axiosInstance.patch(`/company/${id}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};


