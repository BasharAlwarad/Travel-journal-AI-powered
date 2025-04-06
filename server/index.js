import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { errorHandler } from './utils/errorHandler.js';
import usersRouter from './routers/userRouter.js';
import './db/mongoDB.js';

import { PORT, CLIENT_URL } from './config/config.js';

const app = express();

if (!PORT || !CLIENT_URL) {
  console.error('Please provide PORT and CLIENT_URL in .env file');
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

app.get('*', (req, res) => {
  res.status(404).json({ message: 'page not found!' });
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`);
});
