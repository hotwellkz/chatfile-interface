import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './api.js';

dotenv.config();

const app = express();

// Настройка CORS
app.use(cors());

// Установка заголовков безопасности для WebContainer
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

// Парсинг JSON в теле запроса
app.use(express.json());

// Подключаем маршруты API
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});