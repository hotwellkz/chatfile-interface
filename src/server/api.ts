import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS, CONTINUE_PROMPT } from '../utils/constants';
import { SwitchableStream } from '../utils/SwitchableStream';

dotenv.config();

const router = express.Router();

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY не найден в переменных окружения');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function parseCookies(cookieHeader: string) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(rest.join('='));
    }
  });

  return cookies;
}

router.post('/chat', async (req: express.Request, res: express.Response) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).set(corsHeaders).send();
  }

  try {
    const { messages, model } = req.body;
    const cookieHeader = req.headers.cookie;
    const apiKeys = JSON.parse(parseCookies(cookieHeader || '').apiKeys || '{}');

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Неверный формат сообщений' });
    }

    const stream = new SwitchableStream();

    const completion = await openai.chat.completions.create({
      model: model || "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: MAX_TOKENS,
      stream: true,
    });

    let accumulatedResponse = '';

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      accumulatedResponse += content;
      
      if (chunk.choices[0]?.finish_reason === 'length') {
        if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
          throw new Error('Cannot continue message: Maximum segments reached');
        }

        console.log(`Reached max token limit (${MAX_TOKENS}): Continuing message`);
        
        const continuationMessages = [
          ...messages,
          { role: 'assistant' as const, content: accumulatedResponse },
          { role: 'user' as const, content: CONTINUE_PROMPT }
        ];

        const continuationCompletion = await openai.chat.completions.create({
          model: model || "gpt-4",
          messages: continuationMessages,
          temperature: 0.7,
          max_tokens: MAX_TOKENS,
          stream: true,
        });

        for await (const continuationChunk of continuationCompletion) {
          const continuationContent = continuationChunk.choices[0]?.delta?.content || '';
          res.write(continuationContent);
        }
      } else {
        res.write(content);
      }
    }

    res.end();

  } catch (error) {
    console.error('Ошибка при обработке запроса чата:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      return res.status(401).json({ 
        error: 'Неверный или отсутствующий API ключ',
        details: error.message
      });
    }

    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
});

export default router;