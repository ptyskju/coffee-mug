import 'reflect-metadata';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import app from './app';

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
