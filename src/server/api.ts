import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

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

router.post('/chat', async (req: express.Request<{}, {}, ChatRequest>, res: express.Response) => {
  try {
    const { messages } = req.body;

    const response = {
      content: "Ответ от AI",
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