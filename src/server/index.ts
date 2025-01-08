import express from 'express';
import apiRouter from './api.js';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware для установки заголовков безопасности
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

// Middleware для парсинга JSON
app.use(express.json());

// Используем роутер для /api путей
app.use('/api', apiRouter);

// Запускаем сервер
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});