import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const router = express.Router();

router.use(cors({
  origin: [
    'https://bespoke-bavarois-8deceb.netlify.app',
    'https://7db8c8ea-906e-471a-b06c-1e99127746c8.lovableproject.com',
    'http://localhost:5173'
  ],
  methods: ['POST'],
  credentials: true
}));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatRequest {
  messages: Message[];
}

router.post('/chat', async (req: express.Request<{}, {}, ChatRequest>, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Получаем последнее сообщение пользователя
    const lastMessage = messages[messages.length - 1];
    
    // Проверяем, запрашивает ли пользователь создание файла
    if (lastMessage.content.toLowerCase().includes('создай файл')) {
      // Извлекаем имя файла и содержимое из сообщения
      // В данном случае используем фиксированные значения для примера
      return res.json({
        role: 'assistant',
        content: 'Файл test.txt создан.',
        action: 'create_file',
        filename: 'test.txt',
        content: 'Привет, мир!'
      });
    }

    // Если это не запрос на создание файла, используем OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    return res.json({ 
      role: 'assistant',
      content: completion.choices[0].message.content
    });
    
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export { router };