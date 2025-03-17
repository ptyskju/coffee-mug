import { Product } from '../../../models/product.model';
import { Order } from '../../../models/order.model';

export type OrderCalculationsParams = {
  products: OrderCalculationProductDetails[];
  calculatedBasePrice: number;
  order: Order;
};

export type OrderCalculationProductDetails = {
  product: Product;
  quantity: number;
};
