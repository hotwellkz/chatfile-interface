import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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

// Создаем роутер
const router = express.Router();

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

// Подключаем роутер к приложению
app.use('/api', router);

export default app;
