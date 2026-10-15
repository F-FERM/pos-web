
import { AddCategoryPayload } from "@/src/interfaces/category/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddCategoryApi = async (payload: AddCategoryPayload) => {
  try {
    const response = await axiosInstance.post(`/category`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
