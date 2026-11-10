
import { AddCustomerPayload } from "@/src/interfaces/customer/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddCustomerApi = async (payload: AddCustomerPayload) => {
  try {
    const response = await axiosInstance.post(`/customer`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  } 
};
