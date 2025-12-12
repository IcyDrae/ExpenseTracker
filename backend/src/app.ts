import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/itemRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import "reflect-metadata"
import database from './database';
import session from "express-session";

const app = express();

// Enable CORS for all origins
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Session middleware
app.use(
  session({
    secret: "super-secret-key", 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Initialize database connection
database.InitDatabase();

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
