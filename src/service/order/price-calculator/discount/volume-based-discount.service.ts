import { OrderCalculationsParams } from '../type';
import { DiscountCalculatorInterface } from './discount-calculator.interface';

const DISCOUNT_BY_VOLUME = {
  default: undefined,
  low: 0.9,
  medium: 0.8,
  high: 0.7,
};

export class VolumeBasedDiscountService implements DiscountCalculatorInterface {
  public calculatePerOrder(input: OrderCalculationsParams): number | undefined {
    const dataToCalculate = input.reduce(
      (currentData, { quantity: productQuantity, product }) => {
        return {
          volume: currentData.volume + productQuantity,
          price: currentData.price + product.price * productQuantity,
        };
      },
      {
        volume: 0,
        price: 0,
      },
    );

    const discount = this.getDiscount(dataToCalculate.volume);

    if (!discount) {
      return undefined;
    }

    return dataToCalculate.price * discount;
  }

  private getDiscount(orderVolume: number): number | undefined {
    if (orderVolume >= 50) {
      return DISCOUNT_BY_VOLUME.high;
    }

    if (orderVolume >= 10) {
      return DISCOUNT_BY_VOLUME.medium;
    }

    if (orderVolume >= 5) {
      return DISCOUNT_BY_VOLUME.low;
    }

    return DISCOUNT_BY_VOLUME.default;
  }
}
