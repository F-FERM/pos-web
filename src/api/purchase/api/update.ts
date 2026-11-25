
import { AddPurchasePayload } from "@/src/interfaces/purchase/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const EditPurchaseApi = async (
  id: string,
  payload: AddPurchasePayload
) => {
  try {
    const response = await axiosInstance.patch(`/purchase/${id}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
