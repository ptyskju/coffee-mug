import { OrderCalculationsParams } from '../type';
import { DiscountCalculatorInterface } from './discount-calculator.interface';

const DISCOUNT_BY_VOLUME = {
  default: 1,
  low: 0.9,
  medium: 0.8,
  high: 0.7,
};

export class VolumeBasedDiscountService implements DiscountCalculatorInterface {
  public calculatePerOrder(input: OrderCalculationsParams): number {
    const orderVolume = input.products.reduce(
      (currentVolume, { quantity: productQuantity }) =>
        currentVolume + productQuantity,
      0,
    );

    const discount = this.getDiscount(orderVolume);

    return input.calculatedBasePrice * discount;
  }

  private getDiscount(orderVolume: number): number {
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
