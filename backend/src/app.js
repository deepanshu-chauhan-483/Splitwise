import express, { json } from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

app.use(json());
app.use(cors());

// health
app.get('/', (req, res) => res.send('API is up'));
// auth routes
app.use('/api/auth', authRoutes);

// central error handler
app.use(errorHandler);

export default app;
