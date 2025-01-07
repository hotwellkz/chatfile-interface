import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

dotenv.config();

// Создаем экземпляр Router
const router = Router();

// Применяем middleware к роутеру
router.use(cors());
router.use(express.json());

// Инициализируем OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Типизируем интерфейс для тела запроса
interface ChatRequest {
  messages: ChatCompletionMessageParam[];
}

// Определяем маршрут для чата с явной типизацией
router.post('/api/chat', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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

export default router;