
import { AddNumberSettingsPayload } from "@/src/interfaces/number-settings/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddNumberSettingApi = async (payload: AddNumberSettingsPayload) => {
  try {
    const response = await axiosInstance.post(`number-settings`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  } 
};
