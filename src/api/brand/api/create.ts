
import { AddBrandPayload } from "@/src/interfaces/brand/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddBrandApi = async (payload: AddBrandPayload) => {
  try {
    const response = await axiosInstance.post(`/brand`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  } 
};
