import { Order, OrderModel } from '../models/order.model';

export class OrderRepository {
  create(order: Order): Promise<Order> {
    return OrderModel.create(order);
  }

  findAll(limit?: number): Promise<Order[]> {
    return OrderModel.find({}, null, { limit });
  }
}
