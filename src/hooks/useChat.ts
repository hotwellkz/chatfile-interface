import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const newMessage: Message = { role: 'user', content }
      setMessages(prev => [...prev, newMessage])

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Не авторизован')

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            messages: [...messages, newMessage],
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Ошибка при отправке сообщения')
      }

      const assistantMessage = await response.json()
      setMessages(prev => [...prev, assistantMessage])

    } catch (err) {
      setError(err.message)
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  }
}