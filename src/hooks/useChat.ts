import { useState } from 'react'

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

      const response = await fetch('https://backend007.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
        }),
      })

      if (!response.ok) {
        throw new Error('Ошибка сервера')
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