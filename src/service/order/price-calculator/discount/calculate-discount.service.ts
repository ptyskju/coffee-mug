import { injectable } from 'tsyringe';
import { VolumeBasedDiscountService } from './volume-based-discount.service';
import { HolidayBasedDiscountService } from './holiday-based-discount.service';
import { BlackFridayBasedDiscountService } from './black-friday-based-discount.service';
import { DiscountCalculatorInterface } from './discount-calculator.interface';
import { OrderCalculationsParams } from '../type';

@injectable()
export class CalculateDiscountService implements DiscountCalculatorInterface {
  private readonly discountServices: DiscountCalculatorInterface[];

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
