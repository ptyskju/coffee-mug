import { BlackFridayBasedDiscountService } from './black-friday-based-discount.service';
import { Product } from '../../../../models/product.model';
import { OrderCalculationsParams } from '../type';
import { Order } from '../../../../models/order.model';

describe(BlackFridayBasedDiscountService.name, () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return undefined when today is not black friday', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-03-18'));
    const input: OrderCalculationsParams = {
      products: [
        {
          quantity: 5,
          product: { price: 10 } as Product,
        },
      ],
      calculatedBasePrice: 50,
      order: {} as Order,
    };
    const service = new BlackFridayBasedDiscountService();

    const result = service.calculatePerOrder(input);

    expect(result).toEqual(50);
  });

  it('should return discount when today is black friday', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-11-28'));
    const input: OrderCalculationsParams = {
      products: [
        {
          quantity: 5,
          product: { price: 10 } as Product,
        },
      ],
      calculatedBasePrice: 50,
      order: {} as Order,
    };

    const service = new BlackFridayBasedDiscountService();

    const result = service.calculatePerOrder(input);

    expect(result).not.toBeNaN();
    expect(result).toBeCloseTo(37.5);
  });
});
