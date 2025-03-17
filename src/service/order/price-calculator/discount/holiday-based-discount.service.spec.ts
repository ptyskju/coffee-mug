import { HolidayBasedDiscountService } from './holiday-based-discount.service';
import { BankHolidaysInterface } from '../../../bank-holidays/bank-holidays.interface';
import { ProductCategory } from '../../../../shared/product-category.enum';
import { OrderCalculationsParams } from '../type';

describe(HolidayBasedDiscountService.name, () => {
  let service: HolidayBasedDiscountService;
  let bankHolidaysService: jest.Mocked<BankHolidaysInterface>;

  beforeEach(() => {
    jest.clearAllMocks();

    bankHolidaysService = {
      isTodayBankHoliday: jest.fn(),
    };

    service = new HolidayBasedDiscountService(bankHolidaysService);
  });

  it('should return undefined when this is not a bank holiday', () => {
    bankHolidaysService.isTodayBankHoliday.mockReturnValue(false);

    const result = service.calculatePerOrder({
      products: [
        {
          quantity: 10,
          product: {
            price: 100,
            category: ProductCategory.BEAUTY,
          },
        },
      ],
      calculatedBasePrice: 1000,
    } as OrderCalculationsParams);

    expect(result).toEqual(1000);
  });

  describe('today is bank holiday', () => {
    const testCases: {
      name: string;
      input: {
        products: {
          quantity: number;
          product: { price: number; category: ProductCategory };
        }[];
        calculatedBasePrice: number;
      };
      result: number;
    }[] = [
      {
        name: 'should return not discounted price when this product category is not in predefined group',
        input: {
          products: [
            {
              quantity: 10,
              product: {
                price: 100,
                category: ProductCategory.BEAUTY,
              },
            },
          ],
          calculatedBasePrice: 1000,
        },
        result: 1000,
      },
      {
        name: 'should return discounted price when this product category is in predefined group',
        input: {
          products: [
            {
              quantity: 10,
              product: {
                price: 100,
                category: ProductCategory.ELECTRONICS,
              },
            },
          ],
          calculatedBasePrice: 1000,
        },
        result: 850,
      },
      {
        name: 'should return discounted price for only one product when provided products have different categories',
        input: {
          products: [
            {
              quantity: 10,
              product: {
                price: 100,
                category: ProductCategory.ELECTRONICS,
              },
            },
            {
              quantity: 5,
              product: {
                price: 60,
                category: ProductCategory.BEAUTY,
              },
            },
          ],
          calculatedBasePrice: 1300,
        },
        result: 1150,
      },
      {
        name: 'should calculate discounted category multiple times with the same discount category',
        input: {
          products: [
            {
              quantity: 10,
              product: {
                price: 100,
                category: ProductCategory.ELECTRONICS,
              },
            },
            {
              quantity: 5,
              product: {
                price: 60,
                category: ProductCategory.ELECTRONICS,
              },
            },
          ],
          calculatedBasePrice: 1300,
        },
        result: 1105,
      },
      {
        name: 'should calculate discounted category multiple times with different discount categories',
        input: {
          products: [
            {
              quantity: 10,
              product: {
                price: 100,
                category: ProductCategory.ELECTRONICS,
              },
            },
            {
              quantity: 5,
              product: {
                price: 60,
                category: ProductCategory.SPORTS,
              },
            },
          ],
          calculatedBasePrice: 1300,
        },
        result: 1105,
      },
      {
        name: 'should calculate discounted category multiple times with different discount categories and other products',
        input: {
          products: [
            {
              quantity: 10,
              product: {
                price: 100,
                category: ProductCategory.ELECTRONICS,
              },
            },
            {
              quantity: 7,
              product: {
                price: 12,
                category: ProductCategory.FURNITURE,
              },
            },
            {
              quantity: 5,
              product: {
                price: 60,
                category: ProductCategory.SPORTS,
              },
            },
            {
              quantity: 21,
              product: {
                price: 37,
                category: ProductCategory.BOOKS,
              },
            },
          ],
          calculatedBasePrice: 2161,
        },
        result: 1966,
      },
    ];

    testCases.forEach((singleTestCase) => {
      it(singleTestCase.name, () => {
        bankHolidaysService.isTodayBankHoliday.mockReturnValue(true);

        const result = service.calculatePerOrder(
          singleTestCase.input as OrderCalculationsParams,
        );

        expect(result).not.toBeNaN();
        expect(result).toBeCloseTo(singleTestCase.result);
      });
    });
  });
});
