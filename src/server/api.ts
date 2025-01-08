import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Проверяем наличие API ключа
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY не найден в переменных окружения');
  process.exit(1);
}

// Инициализация OpenAI с API ключом
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Определяем интерфейс для тела запроса
interface ChatRequest {
  prompt: string;
}

router.post('/chat', async (req: express.Request, res: express.Response) => {
  try {
    const { prompt } = req.body as ChatRequest;

    if (!prompt) {
      return res.status(400).json({ error: 'Отсутствует поле prompt' });
    }

    console.log('Отправка запроса к OpenAI:', prompt);

    // Отправляем запрос к OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Получаем ответ от OpenAI
    const answer = completion.choices[0].message.content;

    console.log('Получен ответ от OpenAI:', answer);

    // Формируем ответ
    res.json({ 
      answer,
      action: "create_file",
      filename: "example.txt"
    });

  } catch (error) {
    console.error('Ошибка при обработке запроса чата:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
});

export default router;