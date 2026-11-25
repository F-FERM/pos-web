
import { AddLabelDesignerPayload } from "@/src/interfaces/label-designer/create.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const AddLabelDesignerApi = async (payload: AddLabelDesignerPayload) => {
  try {
    const response = await axiosInstance.post(`/label-designer/generate`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
