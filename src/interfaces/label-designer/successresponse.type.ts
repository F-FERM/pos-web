export interface ListLabelDesignerSuccessResponse {
  success: boolean;
  message: string;
  data: Data;
  statusCode: number;
}

interface Data {
  totalLabelsCount: number;
  labelSize: string;
  columns: number;
  labels: Label[];
  html: string;
}

export interface Label {
  productId: string;
  productName: string;
  companyName: string;
  barcode: string;
  barcodeSvg: string;
  price: string;
  rawPrice: number;
}