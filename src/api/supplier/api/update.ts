
import { AddSupplierPayload } from "@/src/interfaces/supplier/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const EditSupplierApi = async (
  id: string,
  payload: AddSupplierPayload
) => {
  try {
    const response = await axiosInstance.patch(`/supplier/${id}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
