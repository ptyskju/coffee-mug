import { query, ValidationChain } from 'express-validator';

export const listAll: ValidationChain[] = [
  query('limit').default(25).isInt({ min: 1 }).toInt(),
];
