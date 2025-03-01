import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { errorHandler } from './utils/errorHandler.js';
import usersRouter from './routers/userRouter.js';
import postsRouter from './routers/postsRoutes.js';
import reviewsRouter from './routers/reviewsRoutes.js';
import chatRouter from './routers/chatRouter.js';
import imageRouter from './routers/imageRouter.js';
import './db/mongoDB.js';

import { PORT, CLIENT_URL } from './config/config.js';

const app = express();
if (!PORT || !CLIENT_URL) {
  console.error('Please provide PORT and CLIENT_URL');
  process.exit(1);
}

app.use(
  json({ limit: '50mb' }),
  cors({
    origin: CLIENT_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
  cookieParser()
);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use(`/api/v1/users`, usersRouter);
app.use(`/api/v1/posts`, postsRouter);
app.use(`/api/v1/reviews`, reviewsRouter);
app.use('/api/v1/chat/completions', chatRouter);
app.use('/api/v1/images/generations', imageRouter);

app.get('*', (req, res) => {
  res.status(404).json({ message: 'page not found!' });
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`);
});
