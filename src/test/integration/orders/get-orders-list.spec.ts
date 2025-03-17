import request from 'supertest';
import app from '../../../app';
import { Order, OrderModel } from '../../../models/order.model';
import { OrderLocation } from '../../../shared/order-location.enum';
import { ObjectId } from 'mongodb';

describe('Orders router - orders list', () => {
  let order1: Order;
  let order2: Order;

  beforeEach(async () => {
    order1 = await OrderModel.create({
      customerId: '12345',
      location: OrderLocation.US,
      orderedProducts: [
        {
          productId: new ObjectId(),
          quantity: 10,
          price: 1,
        },
      ],
      pricePerOrder: 10,
      priceAfterDiscount: 10,
      finalPrice: 10,
    });
    order2 = await OrderModel.create({
      customerId: '456789',
      location: OrderLocation.EUROPE,
      orderedProducts: [
        {
          productId: new ObjectId(),
          quantity: 1,
          price: 5,
        },
      ],
      pricePerOrder: 5,
      priceAfterDiscount: 5,
      finalPrice: 5.75,
    });
  });

  it('should return a list of orders', async () => {
    const response = await request(app).get('/orders').expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0]._id).toEqual(order1._id.toString());
    expect(response.body[1]._id).toEqual(order2._id.toString());
  });

  it('should limit a list of orders to 1', async () => {
    const response = await request(app).get('/orders?limit=1').expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]._id).toEqual(order1._id.toString());
    expect(response.body[1]).toBeUndefined();
  });

  it('should fail if limit is not a number', async () => {
    const response = await request(app).get('/orders?limit=duck').expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveLength(1);
    expect(response.body.error[0]).toEqual({
      type: 'field',
      value: 'duck',
      msg: 'Invalid value',
      path: 'limit',
      location: 'query',
    });
  });
});
