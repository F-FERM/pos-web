import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const DeleteCustomerApi = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/customer/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
