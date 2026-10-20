
import { AddStaffPayload } from "@/src/interfaces/staff/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const EditStaffApi = async (
  id: string,
  payload: AddStaffPayload
) => {
  try {
    const response = await axiosInstance.patch(`/staff/${id}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
