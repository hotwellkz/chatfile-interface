import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const router = express.Router();

// Настраиваем CORS для разрешенных доменов
router.use(cors({
  origin: [
    'https://bespoke-bavarois-8deceb.netlify.app',
    'http://localhost:5173' // для локальной разработки
  ],
  methods: ['POST'],
  credentials: true
}));

// Инициализируем OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Типы для запроса
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatRequest {
  messages: Message[];
}

// Обработчик POST запроса
router.post('/chat', async (req: express.Request<{}, {}, ChatRequest>, res: express.Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    res.json({ 
      role: 'assistant',
      content: completion.choices[0].message.content
    });
    
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router };