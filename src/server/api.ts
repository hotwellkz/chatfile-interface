import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { MAX_TOKENS, CONTINUE_PROMPT } from '../utils/constants';

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

// Handle CORS preflight requests
router.options('/chat', (req, res) => {
  res.writeHead(200, corsHeaders);
  res.end();
});

router.post('/chat', async (req, res) => {
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

    // Set up SSE
    res.writeHead(200, corsHeaders);

    const stream = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages: messages,
      stream: true,
      max_tokens: MAX_TOKENS,
    });

    let accumulatedContent = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      accumulatedContent += content;
      
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }

      // If we hit the token limit, continue the generation
      if (chunk.choices[0]?.finish_reason === 'length') {
        const continuationMessages = [
          ...messages,
          { role: 'assistant', content: accumulatedContent },
          { role: 'user', content: CONTINUE_PROMPT }
        ];

        const continuationStream = await openai.chat.completions.create({
          model: model || "gpt-4o-mini",
          messages: continuationMessages,
          stream: true,
          max_tokens: MAX_TOKENS,
        });

        for await (const continuationChunk of continuationStream) {
          const continuationContent = continuationChunk.choices[0]?.delta?.content || '';
          if (continuationContent) {
            res.write(`data: ${JSON.stringify({ content: continuationContent })}\n\n`);
          }
        }
      }
    }

    res.write('data: [DONE]\n\n');
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