import { PriceCalculatorInterface } from '../price-calculator.interface';
import { injectable } from 'tsyringe';
import { OrderCalculationsParams } from '../type';
import { LocationBasedCalculationsService } from './location-based-calculations.service';

@injectable()
export class BasePriceCalculationsService implements PriceCalculatorInterface {
  private readonly calculationsServices: PriceCalculatorInterface[];

  constructor(
    locationBasedCalculationService: LocationBasedCalculationsService,
  ) {
    this.calculationsServices = [locationBasedCalculationService];
  }

  calculatePerOrder(input: OrderCalculationsParams): number {
    let basePrice = input.calculatedBasePrice;

    for (const singleCalculationsService of this.calculationsServices) {
      basePrice = singleCalculationsService.calculatePerOrder({
        ...input,
        calculatedBasePrice: basePrice,
      });
    }

    return basePrice;
  }
}
