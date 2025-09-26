import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js'; 
import routes from './routes/index.js';

dotenv.config({quiet: true});
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// Routes
app.use('/api/v1', routes);

// 404 handler
app.use((req, res, next) => res.status(404).json({ status: 404, message: 'Not found' }));

// default error handler
app.use((err, req, res, next) => console.log(err) || res.status(500).json({ status: 500, message: 'Oops,something went wrong' }));

export default app;
