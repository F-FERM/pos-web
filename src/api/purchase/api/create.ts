
import { AddPurchasePayload } from "@/src/interfaces/purchase/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddPurchaseApi = async (payload: AddPurchasePayload) => {
  try {
    const response = await axiosInstance.post(`/purchase`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  } 
};
