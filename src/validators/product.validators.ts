import { body, param, ValidationChain } from 'express-validator';

export const restockProductValidators: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Product id is required')
    .isMongoId()
    .withMessage('Product id has to be in mongo id format'),
  body('restock')
    .notEmpty()
    .withMessage('Restock is required')
    .isInt({ min: 1 })
    .withMessage('Restock is has to be positive integer')
    .toInt(),
];
