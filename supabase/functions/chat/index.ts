import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Send request to OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: messages,
      temperature: 0.6,
      max_tokens: 2000,
    })

    const assistantMessage = {
      role: "assistant",
      content: completion.data.choices[0]?.message?.content || "Sorry, I couldn't generate a response",
    }

    return new Response(
      JSON.stringify(assistantMessage),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})