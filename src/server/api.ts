import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Настраиваем CORS с необходимыми заголовками
router.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Добавляем middleware для установки заголовков безопасности
router.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

router.use(express.json());

interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface ChatResponse {
  content: string;
  action?: 'create_file';
  filename?: string;
}

// Обработчик POST запросов к /api/chat
router.post('/chat', async (req: express.Request<{}, {}, ChatRequest>, res: express.Response) => {
  try {
    const { messages } = req.body;

    // Здесь должна быть логика обработки чата
    const response: ChatResponse = {
      content: "Ответ от AI",
      action: "create_file",
      filename: "example.txt"
    };

    return res.json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;