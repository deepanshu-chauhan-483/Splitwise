import express, { json } from 'express';
import cors from 'cors';

import expenseRoutes from "./routes/expenses.routes.js";



import authRoutes from './routes/auth.routes.js';
import errorHandler from './middleware/error.middleware.js';
import balancesRoutes from "./routes/balances.routes.js";
import settlementsRoutes from "./routes/settlements.routes.js";

const app = express();

app.use(json());
app.use(cors());

// health
app.get('/', (req, res) => res.send('API is up'));
// auth routes
app.use('/api/auth', authRoutes);
app.use("/api/expenses", expenseRoutes);

app.use("/api/balances", balancesRoutes);
app.use("/api/settlements", settlementsRoutes);


// central error handler
app.use(errorHandler);

export default app;
