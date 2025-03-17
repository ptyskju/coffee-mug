import { CalculatePriceService } from './calculate-price.service';
import { CalculateDiscountService } from './discount/calculate-discount.service';
import { BasePriceCalculationsService } from './base/base-price-calculations.service';
import { container } from 'tsyringe';
import { Order } from '../../../models/order.model';
import { OrderLocation } from '../../../shared/order-location.enum';
import { Product } from '../../../models/product.model';

jest.mock('./discount/calculate-discount.service');
jest.mock('./base/base-price-calculations.service');

describe(CalculatePriceService.name, () => {
  let service: CalculatePriceService;
  let discountService: jest.Mocked<CalculateDiscountService>;
  let basePriceCalculationService: jest.Mocked<BasePriceCalculationsService>;

  beforeEach(() => {
    jest.clearAllMocks();

    discountService = container.resolve(
      CalculateDiscountService,
    ) as jest.Mocked<CalculateDiscountService>;
    basePriceCalculationService = container.resolve(
      BasePriceCalculationsService,
    ) as jest.Mocked<BasePriceCalculationsService>;

    service = new CalculatePriceService(
      discountService,
      basePriceCalculationService,
    );
  });

  it('should return same price when there was no discount for US order and single product', () => {
    const order = { location: OrderLocation.US } as Order;
    const productDetails = {
      product: { price: 10 } as Product,
      quantity: 1,
    };

    const result = service.calculatePricePerOrder({
      order,
      products: [productDetails],
    });

    expect(result.pricePerOrder).toEqual(10);
  });

  it('should return same price when there was no discount for US order multiple products', () => {
    const order = { location: OrderLocation.US } as Order;
    const products = [
      {
        product: { price: 10 } as Product,
        quantity: 1,
      },
      {
        product: { price: 15 } as Product,
        quantity: 2,
      },
      {
        product: { price: 5 } as Product,
        quantity: 1,
      },
    ];

    const result = service.calculatePricePerOrder({
      order,
      products,
    });

    expect(result.pricePerOrder).toEqual(45);
  });

  it('should return different prices per discount and base', () => {
    const order = { location: OrderLocation.EUROPE } as Order;
    const products = [
      {
        product: { price: 10 } as Product,
        quantity: 1,
      },
      {
        product: { price: 15 } as Product,
        quantity: 2,
      },
      {
        product: { price: 5 } as Product,
        quantity: 3,
      },
    ];

    discountService.calculatePerOrder.mockReturnValue(50);
    basePriceCalculationService.calculatePerOrder.mockReturnValue(57.5);

    const result = service.calculatePricePerOrder({
      order,
      products,
    });

    expect(result.pricePerOrder).toEqual(55);
    expect(result.priceAfterDiscount).toEqual(50);
    expect(result.finalPrice).toEqual(57.5);
  });
});
