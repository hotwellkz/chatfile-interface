import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: messages,
      temperature: 0.6,
      max_tokens: 2000,
    });

    const assistantMessage = {
      role: "assistant",
      content: completion.data.choices[0]?.message?.content || "Извините, не удалось сгенерировать ответ",
    };

    res.json(assistantMessage);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});