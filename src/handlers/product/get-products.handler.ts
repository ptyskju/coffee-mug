import { ProductRepository } from '../../repositories/product.repository';
import { injectable } from 'tsyringe';
import { GetProductsQuery } from '../../queries/get-products.query';
import { Product } from '../../models/product.model';

@injectable()
export class GetProductsHandler {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(query: GetProductsQuery): Promise<Product[]> {
    return this.productRepository.findAll(query.limit);
  }
}
