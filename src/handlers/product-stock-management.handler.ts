import { injectable } from 'tsyringe';
import { ProductRepository } from '../repositories/product.repository';
import { ProductStockManagementCommand } from '../commands/product-stock-management.command';
import { NotFoundError } from '../errors/not-found.error';
import { ForbiddenError } from '../errors/forbidden.error';

@injectable()
export class ProductStockManagementHandler {
  constructor(private readonly productRepository: ProductRepository) {}

  public async increaseStock({
    productId,
    stockChange,
  }: ProductStockManagementCommand): Promise<void> {
    if (stockChange < 0) {
      throw new ForbiddenError('Stock change cannot be negative');
    }

    const product = await this.productRepository.findOne(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    product.stock += stockChange;
    await product.save();
  }

  public async decreaseStock({
    productId,
    stockChange,
  }: ProductStockManagementCommand): Promise<void> {
    const product = await this.productRepository.findOne(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    stockChange = Math.abs(stockChange);

    if (product.stock - stockChange < 0) {
      throw new ForbiddenError(
        'Stock decrease value is bigger than existing product stock',
      );
    }

    product.stock -= stockChange;
    await product.save();
  }
}
