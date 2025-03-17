import { body, ValidationChain } from 'express-validator';
import { OrderLocation } from '../shared/order-location.enum';

export const createOrderValidator: ValidationChain[] = [
  body('customerId').notEmpty().withMessage('Customer id is required'),
  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .isString()
    .custom((value) => Object.values(OrderLocation).includes(value))
    .withMessage(
      `Location should be one of ${JSON.stringify(Object.values(OrderLocation))}`,
    ),
  body('orderedProducts')
    .isArray({ min: 1 })
    .withMessage('Order should contain at least one product'),
  body('orderedProducts.*.productId')
    .notEmpty()
    .withMessage('Ordered product should contain id')
    .isMongoId()
    .withMessage('Product id should be in correct format'),
  body('orderedProducts.*.quantity')
    .notEmpty()
    .withMessage('Ordered product should have quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity should be a number that is greater than 0'),
];
