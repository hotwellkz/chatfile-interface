import express from 'express';
import { OpenAI } from 'openai';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

router.post('/chat', async (req: express.Request<{}, {}, ChatRequest>, res: express.Response) => {
  try {
    const { messages } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    res.json({ 
      message: completion.choices[0].message,
      usage: completion.usage 
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router };