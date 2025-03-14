import { Product, ProductModel } from '../models/product.model';
import { ObjectId } from 'mongoose';

export class ProductRepository {
  create(product: Product): Promise<Product> {
    return ProductModel.create(product);
  }

  findAll(limit?: number): Promise<Product[]> {
    return ProductModel.find({}, null, { limit });
  }
}
