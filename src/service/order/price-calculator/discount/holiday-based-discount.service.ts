import { ProductCategory } from '../../../../shared/product-category.enum';
import { inject, injectable } from 'tsyringe';
import { PriceCalculatorInterface } from '../price-calculator.interface';
import { OrderCalculationsParams } from '../type';
import { BankHolidaysInterface } from '../../../bank-holidays/bank-holidays.interface';

const DISCOUNTED_CATEGORIES = [
  ProductCategory.ELECTRONICS,
  ProductCategory.SPORTS,
];

const DISCOUNT_VALUE = 0.85;

@injectable()
export class HolidayBasedDiscountService implements PriceCalculatorInterface {
  constructor(
    @inject('BankHolidays')
    private readonly bankHolidaysService: BankHolidaysInterface,
  ) {}

  public calculatePerOrder(input: OrderCalculationsParams): number {
    if (!this.bankHolidaysService.isTodayBankHoliday()) {
      return input.calculatedBasePrice;
    }

    return input.products.reduce(
      (currentPrice, { quantity: productQuantity, product }) => {
        let productPricePerQuantity = product.price * productQuantity;
        if (DISCOUNTED_CATEGORIES.includes(product.category)) {
          productPricePerQuantity *= DISCOUNT_VALUE;
        }
        return currentPrice + productPricePerQuantity;
      },
      0,
    );
  }
}
