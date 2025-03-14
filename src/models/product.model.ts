import mongoose, { ObjectId, Schema, Document } from 'mongoose';

export interface Product extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const ProductSchema = new Schema<Product>({
  name: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true, maxlength: 50 },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

export const ProductModel = mongoose.model<Product>('Product', ProductSchema);
