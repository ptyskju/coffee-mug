import { body, param, ValidationChain } from 'express-validator';
import { ProductCategory } from '../shared/product-category.enum';

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

export const singleProductValidators: ValidationChain[] = [
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
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isString()
    .custom((value) => Object.values(ProductCategory).includes(value))
    .withMessage(
      `Category should be one of ${JSON.stringify(Object.values(ProductCategory))}`,
    ),
];
