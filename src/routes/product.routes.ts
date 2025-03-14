import { NextFunction, Response, Router } from 'express';
import { container } from 'tsyringe';
import { GetProductsHandler } from '../handlers/get-products.handler';
import { CreateProductHandler } from '../handlers/create-product.handler';
import { Request } from 'express-serve-static-core';
import { ProductStockManagementHandler } from '../handlers/product-stock-management.handler';
import { ObjectId } from 'mongodb';
import { body, query } from 'express-validator';
import { Product } from '../models/product.model';
import { validate } from '../errors/error.middleware';
import { CreateProductCommand } from '../commands/create-product.command';
import { restockProductValidators } from '../validators/product.validators';

const getProductsHandler = container.resolve(GetProductsHandler);
const createProductHandler = container.resolve(CreateProductHandler);
const productStockManagementHandler = container.resolve(
  ProductStockManagementHandler,
);
const router = Router();

router.get(
  '/',
  validate([
    query('limit').isNumeric().default(25).isInt({ min: 1 }).optional().toInt(),
  ]),
  async (
    req: Request<object, Product[], { limit: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const products = await getProductsHandler.execute({
        limit: Number(req.query.limit),
      });
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  validate([
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .escape()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Name has to be a string between 1 to 50 chars'),
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .escape()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Description has to be a string between 1 to 50 chars'),
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 1 })
      .withMessage('Price has to be a positive number')
      .toFloat(),
    body('stock')
      .notEmpty()
      .withMessage('Stock is required')
      .isInt({ min: 1 })
      .withMessage('Stock has to be a positive number')
      .toInt(),
  ]),
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
