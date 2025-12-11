import express from 'express';
import itemRoutes from './routes/itemRoutes';
import { errorHandler } from './middlewares/errorHandler';
import "reflect-metadata"
import database from './database';

// Initialize database connection

const app = express();

app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);

database.InitDatabase();

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
