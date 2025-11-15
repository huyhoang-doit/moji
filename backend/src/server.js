import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRouter from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json());
app.use(cookieParser());
// public router
app.use('/api/auth', authRouter);

// private router
app.use(protectedRoute);
app.use('/api/users', userRoute);

// connect BD
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
