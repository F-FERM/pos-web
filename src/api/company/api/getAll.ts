import { GetCompanyRequest, ListCompanyResponse } from "@/src/interfaces/company/getAll.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";


export const ListCompanyApi = async () => {
 
  try {
    const params = new URLSearchParams();
  
  
    
    const response = await axiosInstance.get<ListCompanyResponse>(
      `/company?${params.toString()}`
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
