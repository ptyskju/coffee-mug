import { injectable } from 'tsyringe';
import { CalculateDiscountService } from './discount/calculate-discount.service';
import { OrderCalculationProductDetails } from './type';
import { Order } from '../../../models/order.model';
import { BasePriceCalculationsService } from './base/base-price-calculations.service';

@injectable()
export class CalculatePriceService {
  constructor(
    private readonly calculateDiscountService: CalculateDiscountService,
    private readonly basePriceCalculationsService: BasePriceCalculationsService,
  ) {}

  public calculatePricePerOrder(input: {
    order: Order;
    products: OrderCalculationProductDetails[];
  }): {
    pricePerOrder: number;
    priceAfterDiscount: number;
    finalPrice: number;
  } {
    const { products, order } = input;
    const basePrice = this.calculateBaseOrderPrice(products);
    const discountedPrice = this.calculateDiscountService.calculatePerOrder({
      calculatedBasePrice: basePrice,
      products,
      order,
    });

    const finalPrice = this.basePriceCalculationsService.calculatePerOrder({
      calculatedBasePrice: discountedPrice,
      products,
      order,
    });

    return {
      pricePerOrder: this.formatResultPrice(basePrice),
      priceAfterDiscount: this.formatResultPrice(discountedPrice),
      finalPrice: this.formatResultPrice(finalPrice),
    };
  }

  private calculateBaseOrderPrice(
    orderCalculationProductDetails: OrderCalculationProductDetails[],
  ): number {
    return orderCalculationProductDetails.reduce(
      (summarizedPrice, { product, quantity }) =>
        summarizedPrice + product.price * quantity,
      0,
    );
  }

  private formatResultPrice(price: number): number {
    return Math.round((price + Number.EPSILON) * 100) / 100;
  }
}
