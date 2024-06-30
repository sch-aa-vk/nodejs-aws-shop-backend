export type ProductType = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type StockType = {
  product_id: string;
  count: number;
}