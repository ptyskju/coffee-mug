import { PriceCalculatorInterface } from '../price-calculator.interface';
import { OrderCalculationsParams } from '../type';
import { OrderLocation } from '../../../../shared/order-location.enum';
import { ApplicationError } from '../../../../errors/application-error';

export class LocationBasedCalculationsService
  implements PriceCalculatorInterface
{
  calculatePerOrder(input: OrderCalculationsParams): number {
    switch (input.order.location) {
      case OrderLocation.US:
        return input.calculatedBasePrice;
      case OrderLocation.ASIA:
        return input.calculatedBasePrice * 0.95;
      case OrderLocation.EUROPE:
        return input.calculatedBasePrice * 1.15;
      default:
        throw new ApplicationError(
          `Unknown order location: ${input.order.location}`,
        );
    }
  }
}
