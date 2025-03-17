import { Product } from '../../../models/product.model';

export type OrderCalculationsParams = {
  product: Product;
  quantity: number;
}[];
