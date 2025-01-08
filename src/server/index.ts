import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './api';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Добавляем базовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Монтируем API роуты
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});