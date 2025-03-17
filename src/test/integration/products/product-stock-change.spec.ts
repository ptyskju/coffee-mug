import { Product, ProductModel } from '../../../models/product.model';
import { ProductCategory } from '../../../shared/product-category.enum';
import request from 'supertest';
import app from '../../../app';

describe('Products router - product stock change', () => {
  let product: Product;

  beforeEach(async () => {
    product = await ProductModel.create({
      name: 'Product 1',
      description: 'Some description of the product',
      price: 100,
      stock: 500,
      category: ProductCategory.BOOKS,
    });
  });

  describe('product restock', () => {
    it('should restock a product when product exists', async () => {
      const response = await request(app)
        .post(`/products/${product._id.toString()}/restock`)
        .set('content-type', 'application/json')
        .send({
          restock: 10,
        })
        .expect(200);

      expect(response.body.stock).toEqual(510);
    });

    it('should fail when product does not exists', async () => {
      const response = await request(app)
        .post('/products/67d85c0103af708e96a14dfc/restock')
        .set('content-type', 'application/json')
        .send({
          restock: 10,
        })
        .expect(404);

      expect(response.body.error).toEqual('Product not found');
    });

    it('should fail when product id is in incorrect format', async () => {
      const response = await request(app)
        .post('/products/some_random_id/restock')
        .set('content-type', 'application/json')
        .send({
          restock: 10,
        })
        .expect(422);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveLength(1);
      expect(response.body.error[0]).toEqual({
        location: 'params',
        msg: 'Product id has to be in mongo id format',
        path: 'id',
        type: 'field',
        value: 'some_random_id',
      });
    });

    it('should fail when restock parameter is not an integer', async () => {
      const response = await request(app)
        .post(`/products/${product._id.toString()}/restock`)
        .set('content-type', 'application/json')
        .send({
          restock: 'give me more products',
        })
        .expect(422);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveLength(1);
      expect(response.body.error[0]).toEqual({
        location: 'body',
        msg: 'Restock is has to be positive integer',
        path: 'restock',
        type: 'field',
        value: 'give me more products',
      });
    });
  });
  describe('product sell', () => {
    it('should sell products when product exists and stock afer action will be positive', async () => {
      const response = await request(app)
        .post(`/products/${product._id.toString()}/sell`)
        .set('content-type', 'application/json')
        .send({
          restock: 10,
        })
        .expect(200);

      expect(response.body.stock).toEqual(490);
    });

    it('should fail when product does not exists', async () => {
      const response = await request(app)
        .post('/products/67d85c0103af708e96a14dfc/sell')
        .set('content-type', 'application/json')
        .send({
          restock: 10,
        })
        .expect(404);

      expect(response.body.error).toEqual('Product not found');
    });

    it('should fail when product id is in incorrect format', async () => {
      const response = await request(app)
        .post('/products/some_random_id/sell')
        .set('content-type', 'application/json')
        .send({
          restock: 10,
        })
        .expect(422);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveLength(1);
      expect(response.body.error[0]).toEqual({
        location: 'params',
        msg: 'Product id has to be in mongo id format',
        path: 'id',
        type: 'field',
        value: 'some_random_id',
      });
    });

    it('should fail when restock parameter is not an integer', async () => {
      const response = await request(app)
        .post(`/products/${product._id.toString()}/sell`)
        .set('content-type', 'application/json')
        .send({
          restock: 'give me more products',
        })
        .expect(422);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveLength(1);
      expect(response.body.error[0]).toEqual({
        location: 'body',
        msg: 'Restock is has to be positive integer',
        path: 'restock',
        type: 'field',
        value: 'give me more products',
      });
    });

    it('should fail to sell products when product exists and stock afer action will be negative', async () => {
      const response = await request(app)
        .post(`/products/${product._id.toString()}/sell`)
        .set('content-type', 'application/json')
        .send({
          restock: 999,
        })
        .expect(422);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toEqual(
        'Stock decrease value is bigger than existing product stock',
      );
    });
  });
});
