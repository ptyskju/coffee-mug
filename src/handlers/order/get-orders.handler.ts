import { injectable } from 'tsyringe';
import { OrderRepository } from '../../repositories/order.repository';
import { GetOrdersQuery } from '../../queries/get-orders.query';
import { Order } from '../../models/order.model';

@injectable()
export class GetOrdersHandler {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(query: GetOrdersQuery): Promise<Order[]> {
    return this.orderRepository.findAll(query.limit);
  }
}
