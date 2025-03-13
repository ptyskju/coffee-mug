import {Product} from "../models/product.model";

export class CreateProductCommand {
  constructor(public readonly input: Product) {}
}