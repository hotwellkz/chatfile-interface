import { useState } from 'react';
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createFile } from "@/lib/fileSystem";
import Preview from "./Preview";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { toast } = useToast();

  const handleAIResponse = async (content: string) => {
    try {
      // Проверяем, содержит ли ответ команду создания файла
      if (content.includes('<lov-write')) {
        const fileNameMatch = content.match(/file_path="([^"]+)"/);
        const fileName = fileNameMatch ? fileNameMatch[1] : null;
        
        if (fileName) {
          // Извлекаем содержимое файла между тегами lov-write
          const contentMatch = content.match(/<lov-write[^>]*>([\s\S]*?)<\/lov-write>/);
          const fileContent = contentMatch ? contentMatch[1].trim() : '';
          
          await createFile(fileName, fileContent);
          const url = `webcontainer://${fileName}`;
          setPreviewUrl(url);
          
          toast({
            title: "Файл создан",
            description: `Создан файл ${fileName}`,
          });
        }
      }
    } catch (error) {
      console.error('Error handling AI response:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось создать файл"
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch('https://backend007.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка сервера');
      }

      const data = await response.json();
      const aiMessage: Message = {
        role: 'assistant',
        content: data.content
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setInput('');
      
      // Обрабатываем ответ AI для создания файла
      await handleAIResponse(data.content);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : 'Произошла ошибка при отправке сообщения'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground ml-auto' 
                : 'bg-muted'
            } max-w-[80%]`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      
      <Preview fileUrl={previewUrl} />
      
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Введите сообщение..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
          </div>
          <Button 
            size="icon"
            onClick={sendMessage}
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}