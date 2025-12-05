import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRouter from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import friendRoute from './routes/friendRoute.js';
import messageRoute from './routes/messageRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { app, server, io } from './socket/index.js';


dotenv.config();
// const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// setup swagger
const swaggerDocument = JSON.parse(
  fs.readFileSync('./src/swagger.json', 'utf-8')
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// public router
app.use('/api/auth', authRouter);

// private router
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/friends', friendRoute);
app.use('/api/messages', messageRoute);
app.use('/api/conversations', conversationRoute);

// connect BD
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
