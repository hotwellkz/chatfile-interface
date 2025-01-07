import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './api';

dotenv.config();

const app = express();
app.use(express.json());

// Используем API роуты
app.use('/', apiRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});