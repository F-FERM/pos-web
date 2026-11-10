import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const DeleteSupplierApi = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/supplier/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
