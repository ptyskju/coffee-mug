import { Product } from '../../../models/product.model';

export type OrderCalculationsParams = {
  products: OrderCalculationProductDetails[];
  calculatedBasePrice: number;
};

export type OrderCalculationProductDetails = {
  product: Product;
  quantity: number;
};
