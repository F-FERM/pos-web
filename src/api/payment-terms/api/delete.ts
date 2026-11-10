import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const DeletePaymentTermsApi = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`payment-terms/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;  
    }
    throw error;
  }
};
