import express, { Request, Response } from 'express';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './errors/error.middleware';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use(errorHandler);

export default app;
