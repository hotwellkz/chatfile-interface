import express from 'express';
import { router } from './api.js';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware для парсинга JSON
app.use(express.json());

// Используем роутер для /api путей
app.use('/api', router);

// Запускаем сервер
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});