import "reflect-metadata";
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import {connectDB} from "./config/database";
import productRoutes from "./routes/product.routes";

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/products', productRoutes);

async function init() {
  try {
    dotenv.config();
    await connectDB();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

init();
