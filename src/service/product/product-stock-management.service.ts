import { ProductRepository } from '../../repositories/product.repository';
import { ForbiddenError } from '../../errors/forbidden.error';
import { NotFoundError } from '../../errors/not-found.error';
import { injectable } from 'tsyringe';
import { Product } from '../../models/product.model';
import { ObjectId } from 'mongodb';

type ProductStockManagementInput = {
  product: ObjectId | Product;
  stockChange: number;
};

@injectable()
export class ProductStockManagementService {
  constructor(private readonly productRepository: ProductRepository) {}

  public async increaseStock({
    product,
    stockChange,
  }: ProductStockManagementInput): Promise<void> {
    if (stockChange < 0) {
      throw new ForbiddenError('Stock change cannot be negative');
    }

    product = await this.getProduct(product);

    product.stock += stockChange;
    await product.save();
  }

  public async decreaseStock({
    product,
    stockChange,
  }: ProductStockManagementInput): Promise<void> {
    product = await this.getProduct(product);

    stockChange = Math.abs(stockChange);

    if (product.stock - stockChange < 0) {
      throw new ForbiddenError(
        'Stock decrease value is bigger than existing product stock',
      );
    }

    product.stock -= stockChange;
    await product.save();
  }

  private async getProduct(
    productIdOrModel: Product | ObjectId,
  ): Promise<Product> {
    if (!(productIdOrModel instanceof ObjectId)) {
      return productIdOrModel;
    }

    const product = await this.productRepository.findOne(productIdOrModel);

    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }
}
