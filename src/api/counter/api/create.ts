
import { AddCounterPayload } from "@/src/interfaces/counter/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddCounterApi = async (payload: AddCounterPayload) => {
  try {
    const response = await axiosInstance.post(`/counter`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
