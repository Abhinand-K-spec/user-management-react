import express from 'express';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import indexRouter from './routes/index.js'
import userRouter from './routes/users.js'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const port = process.env.PORT || 3000;


export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" MongoDB connected");
  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
  }
};

connectDB();


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', userRouter)
app.use('/admin', indexRouter)


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
