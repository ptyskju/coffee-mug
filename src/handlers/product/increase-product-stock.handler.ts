import { ProductStockManagementService } from '../../service/product/product-stock-management.service';
import { ProductStockManagementCommand } from '../../commands/product-stock-management.command';
import { injectable } from 'tsyringe';
import { Product } from '../../models/product.model';

@injectable()
export class IncreaseProductStockHandler {
  constructor(
    private readonly productStackManager: ProductStockManagementService,
  ) {}

  execute(
    productStockManagementCommand: ProductStockManagementCommand,
  ): Promise<Product> {
    return this.productStackManager.increaseStock({
      product: productStockManagementCommand.productId,
      stockChange: productStockManagementCommand.stockChange,
    });
  }
}
