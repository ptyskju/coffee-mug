import request from 'supertest';
import app from '../../../app';
import { ProductCategory } from '../../../shared/product-category.enum';

describe('Products router - create product', () => {
  it('should create single product', async () => {
    const response = await request(app)
      .post('/products')
      .set('content-type', 'application/json')
      .send({
        name: 'Product 1',
        description: 'Some description of the product',
        price: 100,
        stock: 500,
        category: ProductCategory.BOOKS,
      })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('name');
    expect(response.body.name).toBe('Product 1');
  });

  it('should fail to create a product when price is below 0', async () => {
    const response = await request(app)
      .post('/products')
      .set('content-type', 'application/json')
      .send({
        name: 'Product 1',
        description: 'Some description of the product',
        price: -100,
        stock: 500,
        category: ProductCategory.BOOKS,
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveLength(1);
    expect(response.body.error[0]).toEqual({
      type: 'field',
      value: -100,
      msg: 'Price has to be a positive number',
      path: 'price',
      location: 'body',
    });
  });

  it('should fail to create a product when stock is below 0', async () => {
    const response = await request(app)
      .post('/products')
      .set('content-type', 'application/json')
      .send({
        name: 'Product 1',
        description: 'Some description of the product',
        price: 100,
        stock: -500,
        category: ProductCategory.BOOKS,
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveLength(1);
    expect(response.body.error[0]).toEqual({
      type: 'field',
      value: -500,
      msg: 'Stock has to be a positive number',
      path: 'stock',
      location: 'body',
    });
  });

  it('should fail to create a product when category is not from enum', async () => {
    const response = await request(app)
      .post('/products')
      .set('content-type', 'application/json')
      .send({
        name: 'Product 1',
        description: 'Some description of the product',
        price: 100,
        stock: 500,
        category: 'unknown category',
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveLength(1);
    expect(response.body.error[0]).toEqual({
      type: 'field',
      value: 'unknown category',
      msg: 'Category should be one of ["Electronics","Furniture","Books","Clothing","Beauty","Sports","Software"]',
      path: 'category',
      location: 'body',
    });
  });
});
