import { LocationBasedCalculationsService } from './location-based-calculations.service';
import { OrderCalculationsParams } from '../type';
import { OrderLocation } from '../../../../shared/order-location.enum';
import { Order } from '../../../../models/order.model';

describe(LocationBasedCalculationsService.name, () => {
  it('should leave price as it is when order is from US', () => {
    const input: OrderCalculationsParams = {
      products: [],
      calculatedBasePrice: 100,
      order: {
        location: OrderLocation.US,
      } as Order,
    };

    const service = new LocationBasedCalculationsService();

    const result = service.calculatePerOrder(input);

    expect(result).toBeCloseTo(100);
  });

  it('should make a delivery price reduction when order is from ASIA', () => {
    const input: OrderCalculationsParams = {
      products: [],
      calculatedBasePrice: 100,
      order: {
        location: OrderLocation.ASIA,
      } as Order,
    };

    const service = new LocationBasedCalculationsService();

    const result = service.calculatePerOrder(input);

    expect(result).toBeCloseTo(95);
  });

  it('should make a VAT price increase when order is from EUROPE', () => {
    const input: OrderCalculationsParams = {
      products: [],
      calculatedBasePrice: 100,
      order: {
        location: OrderLocation.EUROPE,
      } as Order,
    };

    const service = new LocationBasedCalculationsService();

    const result = service.calculatePerOrder(input);

    expect(result).toBeCloseTo(115);
  });
});
