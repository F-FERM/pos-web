
import { AddProductPayload } from "@/src/interfaces/product/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const EditProductApi = async (
  id: string,
  payload: AddProductPayload
) => {
  try {
    const response = await axiosInstance.patch(`/product/${id}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
