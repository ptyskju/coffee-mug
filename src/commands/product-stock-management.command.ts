import { ObjectId } from 'mongodb';

export type ProductStockManagementCommand = {
  readonly productId: ObjectId;
  readonly stockChange: number;
};
