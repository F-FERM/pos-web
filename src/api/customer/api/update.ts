
import { AddCustomerPayload } from "@/src/interfaces/customer/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const EditCustomerApi = async (
  id: string,
  payload: AddCustomerPayload
) => {
  try {
    const response = await axiosInstance.patch(`/customer/${id}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
