import {Router} from 'express';
import {container} from 'tsyringe';
import {GetProductsHandler} from "../handlers/get-products.handler";
import {CreateProductHandler} from "../handlers/create-product.handler";

const getProductsHandler = container.resolve(GetProductsHandler);
const createProductHandler = container.resolve(CreateProductHandler);
const router = Router();

router.get('/', async (req, res) => {
  const products = await getProductsHandler.execute({limit: 25});
  res.status(200).json(products);
});

router.post('/', async (req, res) => {
  const product = await createProductHandler.execute(req.body);
  res.status(200).json(product);
})

export default router;