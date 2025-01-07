import express from 'express';
import dotenv from 'dotenv';
import apiApp from './api';

dotenv.config();

const app = express();
app.use(express.json());

// Используем API роуты
app.use('/', apiApp);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});