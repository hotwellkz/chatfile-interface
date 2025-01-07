import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

router.post('/chat', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
    console.error('OpenAI API Error:', error);
    return res.status(500).json({ 
      error: 'Произошла ошибка при обработке запроса' 
    });
  }
});

export { router };