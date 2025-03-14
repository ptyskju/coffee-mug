import { describe } from 'node:test';
import { ProductStockManagementHandler } from './product-stock-management.handler';
import { ProductRepository } from '../repositories/product.repository';
import { ProductStockManagementCommand } from '../commands/product-stock-management.command';
import { ObjectId } from 'mongodb';
import { ProductModel } from '../models/product.model';
import { NotFoundError } from '../errors/not-found.error';
import { ForbiddenError } from '../errors/forbidden.error';
import { NoErrorThrownError } from '../test/utils/error';

jest.mock('../repositories/product.repository');
jest.mock('../models/product.model');

describe(ProductStockManagementHandler.name, () => {
  let handler: ProductStockManagementHandler;
  let productRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    productRepository =
      new ProductRepository() as jest.Mocked<ProductRepository>;

    handler = new ProductStockManagementHandler(productRepository);
  });

  describe('increaseStock', () => {
    it('should increase product stock when product exists', async () => {
      const handlerInput: ProductStockManagementCommand = {
        productId: new ObjectId(),
        stockChange: 10,
      };

      const product = new ProductModel();
      product._id = handlerInput.productId;
      product.stock = 0;

      productRepository.findOne.mockResolvedValue(product);

      await handler.increaseStock(handlerInput);

      expect(product.stock).toEqual(10);
      expect(product.save).toBeCalledTimes(1);
    });

    it('should throw error when product does not exist', async () => {
      const handlerInput: ProductStockManagementCommand = {
        productId: new ObjectId(),
        stockChange: 10,
      };

      productRepository.findOne.mockResolvedValue(null);
      await expect(handler.increaseStock(handlerInput)).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it('should throw error when stock change is negative', async () => {
      const handlerInput: ProductStockManagementCommand = {
        productId: new ObjectId(),
        stockChange: -10,
      };

      try {
        await handler.increaseStock(handlerInput);

        throw new NoErrorThrownError();
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect((error as ForbiddenError).message).toEqual(
          'Stock change cannot be negative',
        );
      }
      expect(productRepository.findOne).toBeCalledTimes(0);
    });
  });

  describe('decreaseStock', () => {
    it('should decrease product stock when product exists and stock quantity is higher than 0', async () => {
      const handlerInput: ProductStockManagementCommand = {
        productId: new ObjectId(),
        stockChange: 10,
      };

      const product = new ProductModel();
      product._id = handlerInput.productId;
      product.stock = 100;

      productRepository.findOne.mockResolvedValue(product);

      await handler.decreaseStock(handlerInput);

      expect(product.stock).toEqual(90);
      expect(product.save).toBeCalledTimes(1);
    });

    it('should throw error when product does not exist', async () => {
      const handlerInput: ProductStockManagementCommand = {
        productId: new ObjectId(),
        stockChange: 10,
      };

      productRepository.findOne.mockResolvedValue(null);
      await expect(handler.decreaseStock(handlerInput)).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it('should throw error when stock will be negative after change', async () => {
      const handlerInput: ProductStockManagementCommand = {
        productId: new ObjectId(),
        stockChange: 10,
      };

      const product = new ProductModel();
      product._id = handlerInput.productId;
      product.stock = 5;
      productRepository.findOne.mockResolvedValue(product);

      try {
        await handler.decreaseStock(handlerInput);

        throw new NoErrorThrownError();
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect((error as ForbiddenError).message).toEqual(
          'Stock decrease value is bigger than existing product stock',
        );
      }

      expect(product.save).toBeCalledTimes(0);
    });

    it('should decrease product stock when product exists and stock quantity is higher than 0 and stock change is negative', async () => {
      const handlerInput: ProductStockManagementCommand = {
        productId: new ObjectId(),
        stockChange: -10,
      };

      const product = new ProductModel();
      product._id = handlerInput.productId;
      product.stock = 100;

      productRepository.findOne.mockResolvedValue(product);

      await handler.decreaseStock(handlerInput);

      expect(product.stock).toEqual(90);
      expect(product.save).toBeCalledTimes(1);
    });
  });
});
