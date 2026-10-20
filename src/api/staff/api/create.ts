
import { AddStaffPayload } from "@/src/interfaces/staff/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddStaffApi = async (payload: AddStaffPayload) => {
  try {
    const response = await axiosInstance.post(`/staff`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
