import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const DeletePrinterApi = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/printer/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
