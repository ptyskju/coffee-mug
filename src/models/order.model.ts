import mongoose, { Document, Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import { OrderLocation } from '../shared/order-location.enum';

export interface Order extends Document<ObjectId> {
  customerId: string;
  location: OrderLocation;
  orderedProducts: {
    productId: ObjectId;
    quantity: number;
    price: number;
  }[];
  pricePerOrder: number;
  priceAfterDiscount: number;
  finalPrice: number;
}

const OrderSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  pricePerOrder: { type: Number, required: true, min: 0 },
  priceAfterDiscount: { type: Number, required: true, min: 0 },
  finalPrice: { type: Number, required: true, min: 0 },
  location: {
    type: String,
    required: true,
    enum: Object.values(OrderLocation),
  },
  orderedProducts: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true, min: 0 },
      price: { type: Number, required: true, min: 0 },
    },
  ],
});

export const OrderModel = mongoose.model<Order>('Order', OrderSchema);
