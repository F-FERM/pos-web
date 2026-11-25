
import { ListBarcodeResponse } from "@/src/interfaces/product/getAllBarcode.type";
import axiosInstance from "@/src/service/axios";
import { AxiosError } from "axios";

export const ListBarcodeApi = async () => {
 
  try {
    
    const response = await axiosInstance.get<ListBarcodeResponse>(
      `/product/generate-barcode`
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
