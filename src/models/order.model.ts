import mongoose, { Document, Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Product } from './product.model';

export interface Order extends Document<ObjectId> {
  customerId: string;
  products: Product[];
  price: number;
  priceAfterDiscount: number;
  discountRule?: string;
}

const OrderSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  priceAfterDiscount: { type: Number, required: true, min: 0 },
  discountRule: { type: String, required: false },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

export const OrderModel = mongoose.model<Order>('Order', OrderSchema);
