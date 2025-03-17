import { OrderCalculationsParams } from './type';

export interface PriceCalculatorInterface {
  calculatePerOrder(input: OrderCalculationsParams): number;
}
