import { injectable } from 'tsyringe';
import { VolumeBasedDiscountService } from './volume-based-discount.service';
import { HolidayBasedDiscountService } from './holiday-based-discount.service';
import { BlackFridayBasedDiscountService } from './black-friday-based-discount.service';
import { PriceCalculatorInterface } from '../price-calculator.interface';
import { OrderCalculationsParams } from '../type';

@injectable()
export class CalculateDiscountService implements PriceCalculatorInterface {
  private readonly discountServices: PriceCalculatorInterface[];

  constructor(
    volumeBasedDiscountService: VolumeBasedDiscountService,
    holidayBasedDiscountService: HolidayBasedDiscountService,
    blackFridayBasedDiscountService: BlackFridayBasedDiscountService,
  ) {
    this.discountServices = [
      volumeBasedDiscountService,
      holidayBasedDiscountService,
      blackFridayBasedDiscountService,
    ];
  }

  public calculatePerOrder(input: OrderCalculationsParams): number {
    let lowestPrice = input.calculatedBasePrice;

    for (const discountService of this.discountServices) {
      const calculatedPrice = discountService.calculatePerOrder(input);

      if (calculatedPrice < lowestPrice) {
        lowestPrice = calculatedPrice;
      }
    }

    return lowestPrice;
  }
}
