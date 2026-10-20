
import { ListCounterByIdResponse } from "@/src/interfaces/counter/getById.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const ListCounterByIdApi = async (id: string) => {
  try {
    const response = await axiosInstance.get<ListCounterByIdResponse>(
      `/counter/${id}`
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
