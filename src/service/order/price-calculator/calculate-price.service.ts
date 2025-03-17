import { injectable } from 'tsyringe';
import { CalculateDiscountService } from './discount/calculate-discount.service';

@injectable()
export class CalculatePriceService {
  constructor(
    private readonly calculateDiscountService: CalculateDiscountService,
  ) {}
}
