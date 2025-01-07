import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

// Создаем экземпляр Router
const router = express.Router();

// Применяем middleware к роутеру
router.use(cors());
router.use(express.json());

// Инициализируем OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Типизируем интерфейс для тела запроса
interface ChatRequest {
  messages: Array<{
    role: string;
    content: string;
  }>;
}

// Определяем маршрут для чата с явной типизацией
router.post('/api/chat', async (req: Request<{}, any, ChatRequest>, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.6,
      max_tokens: 2000,
    });

    const assistantMessage = {
      role: "assistant",
      content: completion.choices[0]?.message?.content || "Извините, не удалось сгенерировать ответ",
    };

    return res.json(assistantMessage);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Экспортируем роутер
export default router;