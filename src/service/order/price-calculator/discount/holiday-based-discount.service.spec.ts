import { HolidayBasedDiscountService } from './holiday-based-discount.service';
import { BankHolidaysInterface } from '../../../bank-holidays/bank-holidays.interface';
import { ProductCategory } from '../../../../shared/product-category.enum';
import { Product } from '../../../../models/product.model';
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

    const result = service.calculatePerOrder([
      {
        quantity: 10,
        product: {
          price: 100,
          category: ProductCategory.BEAUTY,
        },
      },
    ] as { quantity: number; product: Product }[]);

    expect(result).toEqual(undefined);
  });

  describe('today is bank holiday', () => {
    const testCases: {
      name: string;
      input: {
        quantity: number;
        product: { price: number; category: ProductCategory };
      }[];
      result: number | undefined;
    }[] = [
      {
        name: 'should return not discounted price when this product category is not in predefined group',
        input: [
          {
            quantity: 10,
            product: {
              price: 100,
              category: ProductCategory.BEAUTY,
            },
          },
        ],
        result: 1000,
      },
      {
        name: 'should return discounted price when this product category is in predefined group',
        input: [
          {
            quantity: 10,
            product: {
              price: 100,
              category: ProductCategory.ELECTRONICS,
            },
          },
        ],
        result: 850,
      },
      {
        name: 'should return discounted price for only one product when provided products have different categories',
        input: [
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
        result: 1150,
      },
      {
        name: 'should calculate discounted category multiple times with the same discount category',
        input: [
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
        result: 1105,
      },
      {
        name: 'should calculate discounted category multiple times with different discount categories',
        input: [
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
        result: 1105,
      },
      {
        name: 'should calculate discounted category multiple times with different discount categories and other products',
        input: [
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
        expect(result).toBeCloseTo(singleTestCase.result as number);
      });
    });
  });
});
