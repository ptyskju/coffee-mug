import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface Product extends Document<ObjectId> {
  name: string;
  description: string;
  price: number;
  stock: number;
}

const ProductSchema = new Schema<Product>({
  name: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true, maxlength: 50 },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
});

export const ProductModel = mongoose.model<Product>('Product', ProductSchema);
