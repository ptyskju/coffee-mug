import { OrderLocation } from '../shared/order-location.enum';

export type CreateOrderCommand = {
  customerId: string;
  location: OrderLocation;
  orderedProducts: {
    productId: string;
    quantity: number;
  }[];
};
