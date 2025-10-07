// app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import expenseRoutes from "./routes/expenses.routes.js";
import groupRoutes from "./routes/group.routes.js";
import balancesRoutes from "./routes/balances.routes.js";
import settlementsRoutes from "./routes/settlements.routes.js";



import errorHandler from "./middleware/error.middleware.js";

const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// health check
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date() }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/balances", balancesRoutes);
app.use("/api/settlements", settlementsRoutes);

// error handler (last)
app.use(errorHandler);

export default app;
