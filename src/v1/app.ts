import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}`});
import router from './v1.router';
import morganMiddleware from './middleware/morgan.middleware';
import { urlencoded } from 'body-parser';
import { exceptionFunction } from './middleware/exceptionHandler.middleware';

const app: Application = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use(cors());
app.use(helmet());

app.use('/api/ldai-health/v1', router);

// Error handling middleware
app.use(exceptionFunction);

export default app;