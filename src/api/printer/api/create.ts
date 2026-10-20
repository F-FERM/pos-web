
import { AddPrinterPayload } from "@/src/interfaces/printer/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddPrinterApi = async (payload: AddPrinterPayload) => {
  try {
    const response = await axiosInstance.post(`/printer`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
