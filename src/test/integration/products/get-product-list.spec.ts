import request from 'supertest';
import app from '../../../app';
import { ProductCategory } from '../../../shared/product-category.enum';
import { Product, ProductModel } from '../../../models/product.model';

describe('Products router - get products list', () => {
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

  it('should return a list of products', async () => {
    const response = await request(app).get('/products').expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0]._id).toEqual(product1._id.toString());
    expect(response.body[1]._id).toEqual(product2._id.toString());
  });

  it('should limit a list of products to 1', async () => {
    const response = await request(app).get('/products?limit=1').expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]._id).toEqual(product1._id.toString());
    expect(response.body[1]).toBeUndefined();
  });

  it('should fail if limit is not a number', async () => {
    const response = await request(app).get('/products?limit=duck').expect(422);

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
