import { NextFunction, Response, Router } from 'express';
import { container } from 'tsyringe';
import { GetProductsHandler } from '../handlers/product/get-products.handler';
import { CreateProductHandler } from '../handlers/product/create-product.handler';
import { Request } from 'express-serve-static-core';
import { ObjectId } from 'mongodb';
import { Product } from '../models/product.model';
import { validate } from '../errors/error.middleware';
import { CreateProductCommand } from '../commands/create-product.command';
import {
  restockProductValidators,
  singleProductValidators,
} from '../validators/product.validators';
import { listAll } from '../validators/global';
import { IncreaseProductStockHandler } from '../handlers/product/increase-product-stock.handler';
import { DecreaseProductStockHandler } from '../handlers/product/decrease-product-stock.handler';

const getProductsHandler = container.resolve(GetProductsHandler);
const createProductHandler = container.resolve(CreateProductHandler);
const increaseProductStockHandler = container.resolve(
  IncreaseProductStockHandler,
);
const decreaseProductStockHandler = container.resolve(
  DecreaseProductStockHandler,
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
      res.status(201).json(product);
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
      await increaseProductStockHandler.execute({
        productId: new ObjectId(id),
        stockChange: restockValue,
      });

      res.status(204).send();
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
      await decreaseProductStockHandler.execute({
        productId: new ObjectId(id),
        stockChange: restockValue,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
