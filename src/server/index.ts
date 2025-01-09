const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRouter = require('./api');

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://1wox.com',
  'https://chatfile-interface.pages.dev',
  'http://localhost:8080'
];

app.use(cors({
  origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

app.use(express.json());
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});