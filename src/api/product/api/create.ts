
import { AddProductPayload } from "@/src/interfaces/product/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddProductApi = async (payload: AddProductPayload) => {
  try {
    const response = await axiosInstance.post(`/product`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  } 
};
