import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Инициализация OpenAI с API ключом
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

router.post('/chat', async (req: express.Request<{}, {}, ChatRequest>, res: express.Response) => {
  try {
    const { messages } = req.body;

    // Отправляем запрос к OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Получаем ответ от OpenAI
    const aiResponse = completion.choices[0].message;

    // Формируем ответ с дополнительными действиями
    const response = {
      content: aiResponse.content,
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