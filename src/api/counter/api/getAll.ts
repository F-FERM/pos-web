
import { GetCategoryRequest } from "@/src/interfaces/category/getAll.type";
import { ListCounterResponse } from "@/src/interfaces/counter/getAll.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const ListCounterApi = async (params: GetCategoryRequest) => {
  const {
    search,
    page,
    limit,
  
  } = params;
  try {
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
   
    if (page) {
      params.append("page", page.toString());
    }
    if (limit) {
      params.append("limit", limit.toString());
    }
    
    const response = await axiosInstance.get<ListCounterResponse>(
      `/counter?${params.toString()}`
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
