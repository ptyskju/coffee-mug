import { ProductRepository } from '../../repositories/product.repository';
import { CreateProductCommand } from '../../commands/create-product.command';
import { Product } from '../../models/product.model';
import { injectable } from 'tsyringe';

@injectable()
export class CreateProductHandler {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(createProductCommand: CreateProductCommand): Promise<Product> {
    return this.productRepository.create(createProductCommand);
  }
}
