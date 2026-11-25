
import { ListPurchaseByIdResponse } from "@/src/interfaces/purchase/getById.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const ListPurchaseByIdApi = async (id: string) => {
  try {
    const response = await axiosInstance.get<ListPurchaseByIdResponse>(
      `/purchase/${id}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data;

      const normalizedError = new Error(apiError?.error);

      (normalizedError as any).statusCode = apiError?.statusCode;
      (normalizedError as any).raw = apiError;

      throw normalizedError;
    }
    throw error;
  }
};
