
import { AddSubCategoryPayload } from "@/src/interfaces/sub-category/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const EditSubCategoryApi = async (
  id: string,
  payload: AddSubCategoryPayload
) => {
  try {
    const response = await axiosInstance.patch(`/sub-category/${id}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
