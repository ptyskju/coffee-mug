import { OrderCalculationsParams } from '../type';
import { DiscountCalculatorInterface } from './discount-calculator.interface';

const DISCOUNT_VALUE = 0.75;

export class BlackFridayBasedDiscountService
  implements DiscountCalculatorInterface
{
  public calculatePerOrder(input: OrderCalculationsParams): number {
    if (!this.isTodayBlackFriday()) {
      return input.calculatedBasePrice;
    }

    return input.calculatedBasePrice * DISCOUNT_VALUE;
  }

  private isTodayBlackFriday(): boolean {
    const today = new Date();

    if (today.getMonth() !== 10) {
      return false;
    }
    const year = today.getFullYear();
    const novemberFirst = new Date(year, 10, 1);
    const dayOfWeek = novemberFirst.getDay();

    const firstFriday = dayOfWeek === 5 ? 1 : ((5 - dayOfWeek + 7) % 7) + 1;

    const blackFridayDate = firstFriday + 21;

    return today.getDate() === blackFridayDate;
  }
}
