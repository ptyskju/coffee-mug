import { injectable } from 'tsyringe';
import { CreateOrderCommand } from '../../commands/create-order.command';
import { CreateOrderService } from '../../service/order/create-order.service';
import { Order } from '../../models/order.model';

@injectable()
export class CreateOrderHandler {
  constructor(private readonly createOrderService: CreateOrderService) {}

  execute(createOrderCommand: CreateOrderCommand): Promise<Order> {
    return this.createOrderService.createOrder(createOrderCommand);
  }
}
