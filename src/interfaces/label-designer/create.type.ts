export interface AddLabelDesignerPayload {
  items: Item[];
  labelSize: string;
  columns: number;
}

interface Item {
  productId: string;
  quantity: number;
}