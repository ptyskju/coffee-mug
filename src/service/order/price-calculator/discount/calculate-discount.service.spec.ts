import { CalculateDiscountService } from './calculate-discount.service';
import { VolumeBasedDiscountService } from './volume-based-discount.service';
import { HolidayBasedDiscountService } from './holiday-based-discount.service';
import { BlackFridayBasedDiscountService } from './black-friday-based-discount.service';
import { container } from 'tsyringe';
import { OrderCalculationsParams } from '../type';
import { Order } from '../../../../models/order.model';

jest.mock('./volume-based-discount.service');
jest.mock('./holiday-based-discount.service');
jest.mock('./black-friday-based-discount.service');

describe(CalculateDiscountService.name, () => {
  let service: CalculateDiscountService;
  let volumeBasedDiscountService: jest.Mocked<VolumeBasedDiscountService>;
  let holidayBasedDiscountService: jest.Mocked<HolidayBasedDiscountService>;
  let blackFridayBasedDiscountService: jest.Mocked<BlackFridayBasedDiscountService>;

  beforeEach(() => {
    jest.clearAllMocks();
    volumeBasedDiscountService = container.resolve(
      VolumeBasedDiscountService,
    ) as jest.Mocked<VolumeBasedDiscountService>;
    holidayBasedDiscountService = container.resolve(
      HolidayBasedDiscountService,
    ) as jest.Mocked<HolidayBasedDiscountService>;
    blackFridayBasedDiscountService = container.resolve(
      BlackFridayBasedDiscountService,
    ) as jest.Mocked<BlackFridayBasedDiscountService>;

    service = new CalculateDiscountService(
      volumeBasedDiscountService,
      holidayBasedDiscountService,
      blackFridayBasedDiscountService,
    );
  });

  it('should get volume based discount because it was the lowest', () => {
    const input: OrderCalculationsParams = {
      products: [],
      calculatedBasePrice: 10000,
      order: {} as Order,
    };

    volumeBasedDiscountService.calculatePerOrder.mockReturnValue(900);
    holidayBasedDiscountService.calculatePerOrder.mockReturnValue(
      input.calculatedBasePrice,
    );
    blackFridayBasedDiscountService.calculatePerOrder.mockReturnValue(
      input.calculatedBasePrice,
    );

    const result = service.calculatePerOrder(input);

    expect(result).toEqual(900);
  });

  it('should get black friday based discount because it was the lowest, but every discount was successfully calculated', () => {
    const input: OrderCalculationsParams = {
      products: [],
      calculatedBasePrice: 10000,
      order: {} as Order,
    };

    volumeBasedDiscountService.calculatePerOrder.mockReturnValue(900);
    holidayBasedDiscountService.calculatePerOrder.mockReturnValue(800);
    blackFridayBasedDiscountService.calculatePerOrder.mockReturnValue(700);

    const result = service.calculatePerOrder(input);

    expect(result).toEqual(700);
  });
});
