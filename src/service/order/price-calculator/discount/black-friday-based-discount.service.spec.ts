import { BlackFridayBasedDiscountService } from './black-friday-based-discount.service';
import { Product } from '../../../../models/product.model';

describe(BlackFridayBasedDiscountService.name, () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return undefined when today is not black friday', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-03-18'));
    const input = [
      {
        quantity: 5,
        product: { price: 10 } as Product,
      },
    ];
    const service = new BlackFridayBasedDiscountService();

    const result = service.calculatePerOrder(input);

    expect(result).toEqual(undefined);
  });

  it('should return discount when today is black friday', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-11-28'));

    const input = [
      {
        quantity: 5,
        product: { price: 10 } as Product,
      },
    ];
    const service = new BlackFridayBasedDiscountService();

    const result = service.calculatePerOrder(input);

    expect(result).not.toBeNaN();
    expect(result).toBeCloseTo(37.5);
  });
});
