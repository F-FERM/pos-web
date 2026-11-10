import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const DeletePrivilegeApi = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/privilege/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
