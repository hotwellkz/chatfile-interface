const { MAX_TOKENS } = require('./constants.cjs');

async function streamText(messages, env, options = { toolChoice: 'none' }, apiKeys) {
  const openaiKey = apiKeys['openai'] || env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    throw new Error('Missing OpenAI API key');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      max_tokens: MAX_TOKENS,
      stream: true,
      tool_choice: options.toolChoice,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const stream = response.body;
  if (!stream) {
    throw new Error('No response stream from OpenAI');
  }

  return {
    stream,
    toAIStream: () => stream,
  };
}

module.exports = {
  streamText
};
