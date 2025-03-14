import { Router } from 'express';
import { container } from 'tsyringe';
import { GetProductsHandler } from '../handlers/get-products.handler';
import { CreateProductHandler } from '../handlers/create-product.handler';
import { Request } from 'express-serve-static-core';
import { ProductStockManagementHandler } from '../handlers/product-stock-management.handler';
import { ObjectId } from 'mongodb';

const getProductsHandler = container.resolve(GetProductsHandler);
const createProductHandler = container.resolve(CreateProductHandler);
const productStockManagementHandler = container.resolve(
  ProductStockManagementHandler,
);
const router = Router();

router.get('/', async (req, res) => {
  const products = await getProductsHandler.execute({ limit: 25 });
  res.status(200).json(products);
});

router.post('/', async (req, res) => {
  const product = await createProductHandler.execute(req.body);
  res.status(200).json(product);
});

router.post(
  '/:id/restock',
  async (req: Request<{ id: string }, void, { restock: number }>, res) => {
    const id = req.params.id;
    const restockValue = req.body.restock;
    await productStockManagementHandler.increaseStock({
      productId: new ObjectId(id),
      stockChange: restockValue,
    });

    res.status(200).send();
  },
);

router.post(
  '/:id/sell',
  async (req: Request<{ id: string }, void, { restock: number }>, res) => {
    console.log('start sell');
    const id = req.params.id;
    const restockValue = req.body.restock;
    console.log('params', id, restockValue);
    await productStockManagementHandler.decreaseStock({
      productId: new ObjectId(id),
      stockChange: restockValue,
    });
    console.log('end sell');

    res.status(200).send();
  },
);

export default router;
