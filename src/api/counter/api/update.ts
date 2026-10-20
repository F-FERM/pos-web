
import { AddCounterPayload } from "@/src/interfaces/counter/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const EditCounterApi = async (
  id: string,
  payload: AddCounterPayload
) => {
  try {
    const response = await axiosInstance.patch(`/counter/${id}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
