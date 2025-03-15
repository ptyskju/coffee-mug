import { NextFunction, Response, Router } from 'express';
import { container } from 'tsyringe';
import { GetOrdersHandler } from '../handlers/order/get-orders.handler';
import { validate } from '../errors/error.middleware';
import { listAll } from '../validators/global';
import { Request } from 'express-serve-static-core';
import { Product } from '../models/product.model';

const getOrdersHandler = container.resolve(GetOrdersHandler);

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
      const orders = await getOrdersHandler.execute({ limit: req.query.limit });
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
