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
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

router.post('/chat', async (req: express.Request, res: express.Response) => {
  try {
    const { messages } = req.body as ChatRequest;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Неверный формат сообщений' });
    }

    console.log('Отправка запроса к OpenAI:', messages);

    // Отправляем запрос к OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Получаем ответ от OpenAI
    const aiResponse = completion.choices[0].message;

    console.log('Получен ответ от OpenAI:', aiResponse);

    // Формируем ответ с дополнительными действиями
    const response = {
      content: aiResponse.content,
      action: "create_file",
      filename: "example.txt"
    };

    res.json(response);

  } catch (error) {
    console.error('Ошибка при обработке запроса чата:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
});

export default router;