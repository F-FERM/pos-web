import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const DeleteCounterApi = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/counter/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
