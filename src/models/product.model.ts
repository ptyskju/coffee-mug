import mongoose, {Schema} from "mongoose";

export interface Product {
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
