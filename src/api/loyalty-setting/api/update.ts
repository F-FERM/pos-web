
import { UpdateLoyaltySetting } from "@/src/interfaces/loyalty-settings/update.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const EditLoyaltySettingApi = async (

  payload: UpdateLoyaltySetting
) => {
  try {
    const response = await axiosInstance.patch(`/loyalty-settings/`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
