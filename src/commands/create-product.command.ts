import { Product } from '../models/product.model';

export type CreateProductCommand = {
  readonly input: Product;
};
