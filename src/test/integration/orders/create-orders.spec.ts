import { Product, ProductModel } from '../../../models/product.model';
import { ProductCategory } from '../../../shared/product-category.enum';
import { CreateOrderCommand } from '../../../commands/create-order.command';
import { OrderLocation } from '../../../shared/order-location.enum';
import request from 'supertest';
import app from '../../../app';

describe('Orders router - create order', () => {
  let product1: Product;
  let product2: Product;

  beforeEach(async () => {
    product1 = await ProductModel.create({
      name: 'Product 1',
      description: 'Some description of the product',
      price: 100,
      stock: 500,
      category: ProductCategory.BOOKS,
    });
    product2 = await ProductModel.create({
      name: 'Product 2',
      description: 'Different description of the product',
      price: 500,
      stock: 1000,
      category: ProductCategory.SPORTS,
    });
  });

  it('should be able to create an order without any discounts for user from US', async () => {
    const createOrder: CreateOrderCommand = {
      customerId: '12345',
      location: OrderLocation.US,
      orderedProducts: [
        {
          productId: product1._id.toString(),
          quantity: 1,
        },
      ],
    };

    const response = await request(app)
      .post('/orders')
      .set('content-type', 'application/json')
      .send(createOrder)
      .expect(201);

    expect(response.body._id).toBeDefined();
    expect(response.body.customerId).toEqual(createOrder.customerId);
    expect(response.body.location).toEqual(OrderLocation.US);
    expect(response.body.orderedProducts).toHaveLength(1);
    expect(response.body.orderedProducts[0].productId).toEqual(
      product1._id.toString(),
    );
    expect(response.body.pricePerOrder).toEqual(100);
    expect(response.body.priceAfterDiscount).toEqual(100);
    expect(response.body.finalPrice).toEqual(100);
  });

  it('should be able to create an order with volume based discount for user from US', async () => {
    const createOrder: CreateOrderCommand = {
      customerId: '12345',
      location: OrderLocation.US,
      orderedProducts: [
        {
          productId: product1._id.toString(),
          quantity: 100,
        },
      ],
    };

    const response = await request(app)
      .post('/orders')
      .set('content-type', 'application/json')
      .send(createOrder)
      .expect(201);

    expect(response.body._id).toBeDefined();
    expect(response.body.customerId).toEqual(createOrder.customerId);
    expect(response.body.location).toEqual(OrderLocation.US);
    expect(response.body.orderedProducts).toHaveLength(1);
    expect(response.body.orderedProducts[0].productId).toEqual(
      product1._id.toString(),
    );
    expect(response.body.pricePerOrder).toEqual(10000);
    expect(response.body.priceAfterDiscount).toEqual(7000);
    expect(response.body.finalPrice).toEqual(7000);
  });

  it('should be able to create an order with volume based discount for user from ASIA with price reduction', async () => {
    const createOrder: CreateOrderCommand = {
      customerId: '12345',
      location: OrderLocation.ASIA,
      orderedProducts: [
        {
          productId: product1._id.toString(),
          quantity: 100,
        },
      ],
    };

    const response = await request(app)
      .post('/orders')
      .set('content-type', 'application/json')
      .send(createOrder)
      .expect(201);

    expect(response.body._id).toBeDefined();
    expect(response.body.customerId).toEqual(createOrder.customerId);
    expect(response.body.location).toEqual(OrderLocation.ASIA);
    expect(response.body.orderedProducts).toHaveLength(1);
    expect(response.body.orderedProducts[0].productId).toEqual(
      product1._id.toString(),
    );
    expect(response.body.pricePerOrder).toEqual(10000);
    expect(response.body.priceAfterDiscount).toEqual(7000);
    expect(response.body.finalPrice).toEqual(6650);
  });

  it('should be able to create an order with volume based discount for user from EUROPE with price increase with multiple products', async () => {
    const createOrder: CreateOrderCommand = {
      customerId: '12345',
      location: OrderLocation.EUROPE,
      orderedProducts: [
        {
          productId: product1._id.toString(),
          quantity: 15,
        },
        {
          productId: product2._id.toString(),
          quantity: 5,
        },
      ],
    };

    const response = await request(app)
      .post('/orders')
      .set('content-type', 'application/json')
      .send(createOrder)
      .expect(201);

    expect(response.body._id).toBeDefined();
    expect(response.body.customerId).toEqual(createOrder.customerId);
    expect(response.body.location).toEqual(OrderLocation.EUROPE);
    expect(response.body.orderedProducts).toHaveLength(2);
    expect(response.body.orderedProducts[0].productId).toEqual(
      product1._id.toString(),
    );
    expect(response.body.orderedProducts[1].productId).toEqual(
      product2._id.toString(),
    );
    expect(response.body.pricePerOrder).toEqual(4000);
    expect(response.body.priceAfterDiscount).toEqual(3200);
    expect(response.body.finalPrice).toEqual(3680);
  });

  it('should throw an error when customer id was not send', async () => {
    const response = await request(app)
      .post('/orders')
      .set('content-type', 'application/json')
      .send({
        location: OrderLocation.US,
        orderedProducts: [
          {
            productId: product1._id.toString(),
            quantity: 1,
          },
        ],
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveLength(1);
    expect(response.body.error[0]).toEqual({
      type: 'field',
      msg: 'Customer id is required',
      path: 'customerId',
      location: 'body',
    });
  });

  it('should throw an error when provided location is not from enum', async () => {
    const response = await request(app)
      .post('/orders')
      .set('content-type', 'application/json')
      .send({
        customerId: '12345',
        location: 'moon',
        orderedProducts: [
          {
            productId: product1._id.toString(),
            quantity: 1,
          },
        ],
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveLength(1);
    expect(response.body.error[0]).toEqual({
      type: 'field',
      msg: 'Location should be one of ["US","EUROPE","ASIA"]',
      path: 'location',
      location: 'body',
      value: 'moon',
    });
  });

  it('should throw an error when ordered products array is empty', async () => {
    const response = await request(app)
      .post('/orders')
      .set('content-type', 'application/json')
      .send({
        customerId: '12345',
        location: OrderLocation.ASIA,
        orderedProducts: [],
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveLength(1);
    expect(response.body.error[0]).toEqual({
      type: 'field',
      msg: 'Order should contain at least one product',
      path: 'orderedProducts',
      location: 'body',
      value: [],
    });
  });

  it('should throw an error when ordered products contains errors', async () => {
    const response = await request(app)
      .post('/orders')
      .set('content-type', 'application/json')
      .send({
        customerId: '12345',
        location: OrderLocation.ASIA,
        orderedProducts: [
          {
            productId: '',
            quantity: 0,
          },
        ],
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveLength(3);
    expect(response.body.error[0]).toEqual({
      type: 'field',
      msg: 'Ordered product should contain id',
      path: 'orderedProducts[0].productId',
      location: 'body',
      value: '',
    });
    expect(response.body.error[1]).toEqual({
      type: 'field',
      msg: 'Product id should be in correct format',
      path: 'orderedProducts[0].productId',
      location: 'body',
      value: '',
    });
    expect(response.body.error[2]).toEqual({
      type: 'field',
      msg: 'Quantity should be a number that is greater than 0',
      path: 'orderedProducts[0].quantity',
      location: 'body',
      value: 0,
    });
  });
});
