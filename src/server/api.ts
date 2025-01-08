import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { MAX_TOKENS, CONTINUE_PROMPT } from '../utils/constants';
import type { Message } from '../types';

dotenv.config();

const router = express.Router();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, cookie',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
};

function parseCookies(cookieHeader: string) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    if (name && rest.length) {
      const decodedName = decodeURIComponent(name.trim());
      const decodedValue = decodeURIComponent(rest.join('=').trim());
      cookies[decodedName] = decodedValue;
    }
  });

  return cookies;
}

router.post('/chat', async (req: express.Request, res: express.Response) => {
  try {
    const { messages, model } = req.body;
    const cookieHeader = req.headers.cookie;
    const apiKeys = JSON.parse(parseCookies(cookieHeader || '').apiKeys || '{}');
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Неверный формат сообщений' });
    }

    const openai = new OpenAI({
      apiKey: apiKeys.openai || process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: model || "gpt-4",
      messages: messages,
      stream: true,
      max_tokens: MAX_TOKENS,
    });

    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error: any) {
    console.error('Ошибка при обработке запроса чата:', error);
    
    if (error.message?.includes('API key')) {
      return res.status(401).json({ 
        error: 'Неверный или отсутствующий API ключ',
        details: error.message
      });
    }

    return res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
});

export default router;