import {Product, ProductModel} from "../models/product.model";

export class ProductRepository {

  create(product: Product): Promise<Product> {
    return ProductModel.create(product);
  }

  findAll(limit?: number): Promise<Product[]> {
    return ProductModel.find({}, null, {limit});
  }
}
