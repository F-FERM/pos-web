
import { AddPaymentTermPayload } from "@/src/interfaces/payment-terms/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddPaymentTermsApi = async (payload: AddPaymentTermPayload) => {
  try {
    const response = await axiosInstance.post(`/payment-terms`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  } 
};
