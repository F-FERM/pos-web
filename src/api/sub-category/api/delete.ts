import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const DeleteSubCategoryApi = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/sub-category/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
