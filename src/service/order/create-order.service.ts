import { injectable } from 'tsyringe';
import { OrderRepository } from '../../repositories/order.repository';
import { CreateOrderCommand } from '../../commands/create-order.command';
import { Order, OrderModel } from '../../models/order.model';
import { ProductRepository } from '../../repositories/product.repository';
import { NotFoundError } from '../../errors/not-found.error';
import { ObjectId } from 'mongodb';
import { ProductStockManagementService } from '../product/product-stock-management.service';
import { CalculatePriceService } from './price-calculator/calculate-price.service';
import { OrderCalculationProductDetails } from './price-calculator/type';

@injectable()
export class CreateOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly productStockManagement: ProductStockManagementService,
    private readonly calculatePriceService: CalculatePriceService,
  ) {}

  public async createOrder(
    createOrderCommand: CreateOrderCommand,
  ): Promise<Order> {
    const newOrder = new OrderModel({
      customerId: createOrderCommand.customerId,
      location: createOrderCommand.location,
    });
    const productsPerOrder: OrderCalculationProductDetails[] = [];

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

    this.updatePrices(newOrder, productsPerOrder);
    await this.changeStock(productsPerOrder);
    return await this.orderRepository.create(newOrder);
  }

  private async changeStock(
    productsPerOrder: OrderCalculationProductDetails[],
  ): Promise<void> {
    for (const { product, quantity } of productsPerOrder) {
      await this.productStockManagement.decreaseStock({
        product,
        stockChange: quantity,
      });
    }
  }

  private updatePrices(
    newOrder: Order,
    productsPerOrder: OrderCalculationProductDetails[],
  ): void {
    const { pricePerOrder, priceAfterDiscount, finalPrice } =
      this.calculatePriceService.calculatePricePerOrder({
        order: newOrder,
        products: productsPerOrder,
      });

    newOrder.pricePerOrder = pricePerOrder;
    newOrder.priceAfterDiscount = priceAfterDiscount;
    newOrder.finalPrice = finalPrice;
  }
}
