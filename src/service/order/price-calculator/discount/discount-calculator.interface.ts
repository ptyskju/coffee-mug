import { OrderCalculationsParams } from '../type';

export interface DiscountCalculatorInterface {
  calculatePerOrder(input: OrderCalculationsParams): number | undefined;
}
