export interface ListBarcodeResponse {
  success: boolean;
  message: string;
  data: Data;
  statusCode: number;
}

interface Data {
  barcode: string;
}