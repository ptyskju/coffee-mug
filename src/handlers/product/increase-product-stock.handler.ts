import { ProductStockManagementService } from '../../service/product/product-stock-management.service';
import { ProductStockManagementCommand } from '../../commands/product-stock-management.command';
import { injectable } from 'tsyringe';

@injectable()
export class IncreaseProductStockHandler {
  constructor(
    private readonly productStackManager: ProductStockManagementService,
  ) {}

  execute(
    productStockManagementCommand: ProductStockManagementCommand,
  ): Promise<void> {
    return this.productStackManager.increaseStock(
      productStockManagementCommand,
    );
  }
}
