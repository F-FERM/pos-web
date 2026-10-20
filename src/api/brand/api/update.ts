
import { AddBrandPayload } from "@/src/interfaces/brand/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const EditBrandApi = async (
  id: string,
  payload: AddBrandPayload
) => {
  try {
    const response = await axiosInstance.patch(`/brand/${id}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
