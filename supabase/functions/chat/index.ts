import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { MAX_TOKENS, CONTINUE_PROMPT } from '../_shared/constants.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const { messages, model } = await req.json()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages,
        stream: true,
        max_tokens: MAX_TOKENS,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate response')
    }

    // Set up SSE response
    const headers = new Headers(corsHeaders)
    headers.set('Content-Type', 'text/event-stream')
    headers.set('Cache-Control', 'no-cache')
    headers.set('Connection', 'keep-alive')

    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const reader = response.body?.getReader()

    if (!reader) {
      throw new Error('No response body')
    }

    // Process the stream
    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split('\n').filter(line => line.trim() !== '')

          for (const line of lines) {
            if (line.includes('[DONE]')) continue
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices[0]?.delta?.content || ''
                if (content) {
                  await writer.write(new TextEncoder().encode(content))
                }
              } catch (e) {
                console.error('Error parsing JSON:', e)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error processing stream:', error)
      } finally {
        await writer.close()
      }
    }

    processStream()

    return new Response(stream.readable, {
      headers,
    })
  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})