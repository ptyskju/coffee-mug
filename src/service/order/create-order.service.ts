import { injectable } from 'tsyringe';
import { OrderRepository } from '../../repositories/order.repository';
import { CreateOrderCommand } from '../../commands/create-order.command';
import { Order, OrderModel } from '../../models/order.model';
import { ProductRepository } from '../../repositories/product.repository';
import { Product, ProductModel } from '../../models/product.model';
import { NotFoundError } from '../../errors/not-found.error';
import { ObjectId } from 'mongodb';
import { ProductStockManagementService } from '../product/product-stock-management.service';

type ProductPerOrder = {
  product: Product;
  quantity: number;
};

@injectable()
export class CreateOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly productStockManagement: ProductStockManagementService,
  ) {}

  public async createOrder(
    createOrderCommand: CreateOrderCommand,
  ): Promise<Order> {
    const newOrder = new OrderModel();
    const productsPerOrder: ProductPerOrder[] = [];

    for (const singleOrderedProduct of createOrderCommand.orderedProducts) {
      const fetchedProduct = await this.productRepository.findOne(
        new ObjectId(singleOrderedProduct.productId),
      );

      if (!fetchedProduct) {
        throw new NotFoundError(
          `Product ${singleOrderedProduct.productId} not found`,
        );
      }

      newOrder.orderedProducts.push({
        productId: fetchedProduct._id,
        quantity: singleOrderedProduct.quantity,
        price: fetchedProduct.price,
      });

      productsPerOrder.push({
        product: fetchedProduct,
        quantity: singleOrderedProduct.quantity,
      });
    }

    await this.changeStock(productsPerOrder);

    return await this.orderRepository.create(newOrder);
  }

  private async changeStock(
    productsPerOrder: ProductPerOrder[],
  ): Promise<void> {
    const session = await ProductModel.startSession();
    session.startTransaction();

    try {
      for (const { product, quantity } of productsPerOrder) {
        await this.productStockManagement.decreaseStock({
          product,
          stockChange: quantity,
        });
      }
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }
}
