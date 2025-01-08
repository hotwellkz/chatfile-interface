import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

router.post('/chat', async (req: express.Request<{}, {}, ChatRequest>, res: express.Response) => {
  try {
    const { messages } = req.body;
    
    // Здесь можно добавить интеграцию с OpenAI
    // Пока возвращаем тестовый ответ
    const response = {
      content: "Тестовый ответ от сервера",
      action: "create_file",
      filename: "example.txt"
    };

    res.json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
