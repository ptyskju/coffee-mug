import { NextFunction, Response, Router } from 'express';
import { container } from 'tsyringe';
import { GetProductsHandler } from '../handlers/product/get-products.handler';
import { CreateProductHandler } from '../handlers/product/create-product.handler';
import { Request } from 'express-serve-static-core';
import { ProductStockManagementHandler } from '../handlers/product/product-stock-management.handler';
import { ObjectId } from 'mongodb';
import { Product } from '../models/product.model';
import { validate } from '../errors/error.middleware';
import { CreateProductCommand } from '../commands/create-product.command';
import {
  restockProductValidators,
  singleProductValidators,
} from '../validators/product.validators';
import { listAll } from '../validators/global';

const getProductsHandler = container.resolve(GetProductsHandler);
const createProductHandler = container.resolve(CreateProductHandler);
const productStockManagementHandler = container.resolve(
  ProductStockManagementHandler,
);
const router = Router();

router.get(
  '/',
  validate(listAll),
  async (
    req: Request<object, Product[], null, { limit: number }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const products = await getProductsHandler.execute({
        limit: req.query.limit,
      });
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  validate(singleProductValidators),
  async (
    req: Request<object, Product, CreateProductCommand>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const product = await createProductHandler.execute(req.body);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/:id/restock',
  validate(restockProductValidators),
  async (
    req: Request<{ id: string }, void, { restock: number }>,
    res: Response,
    next: NextFunction,
  ) => {
    const id = req.params.id;
    const restockValue = req.body.restock;

    try {
      await productStockManagementHandler.increaseStock({
        productId: new ObjectId(id),
        stockChange: restockValue,
      });

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/:id/sell',
  validate(restockProductValidators),
  async (
    req: Request<{ id: string }, void, { restock: number }>,
    res: Response,
    next: NextFunction,
  ) => {
    const id = req.params.id;
    const restockValue = req.body.restock;

    try {
      await productStockManagementHandler.decreaseStock({
        productId: new ObjectId(id),
        stockChange: restockValue,
      });

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
