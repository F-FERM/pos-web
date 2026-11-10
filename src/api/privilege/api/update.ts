
import { AddPrivilegePayload } from "@/src/interfaces/privilege/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const EditPrivilegeApi = async (
  id: string,
  payload: AddPrivilegePayload
) => {
  try {
    const response = await axiosInstance.patch(`/privilege/${id}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
