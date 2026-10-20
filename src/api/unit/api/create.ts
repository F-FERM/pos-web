
import { AddUnitPayload } from "@/src/interfaces/unit/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddUnitApi = async (payload: AddUnitPayload) => {
  try {
    const response = await axiosInstance.post(`/unit`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
