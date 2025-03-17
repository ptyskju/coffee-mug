import { NextFunction, Response, Router } from 'express';
import { container } from 'tsyringe';
import { GetOrdersHandler } from '../handlers/order/get-orders.handler';
import { validate } from '../errors/error.middleware';
import { listAll } from '../validators/global';
import { Request } from 'express-serve-static-core';
import { CreateOrderHandler } from '../handlers/order/create-order.handler';
import { Order } from '../models/order.model';
import { CreateOrderCommand } from '../commands/create-order.command';
import { createOrderValidator } from '../validators/order.validators';

const getOrdersHandler = container.resolve(GetOrdersHandler);
const createOrderHandler = container.resolve(CreateOrderHandler);

const router = Router();

router.get(
  '/',
  validate(listAll),
  async (
    req: Request<object, Order[], null, { limit: number }>,
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

router.post(
  '/',
  validate(createOrderValidator),
  async (
    req: Request<object, Order, CreateOrderCommand>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const order = await createOrderHandler.execute(req.body);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
