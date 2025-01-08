import { useState, useEffect } from 'react';
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createFile, initWebContainer, destroyWebContainer } from "@/lib/fileSystem";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type AIResponse = {
  content: string;
  action?: 'create_file';
  filename?: string;
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const { toast } = useToast();

  // Инициализируем WebContainer один раз при монтировании компонента
  useEffect(() => {
    const initContainer = async () => {
      try {
        await initWebContainer();
        console.log('WebContainer initialized successfully in Chat component');
      } catch (error) {
        console.error('Failed to initialize WebContainer in Chat component:', error);
        toast({
          variant: "destructive",
          title: "Ошибка инициализации",
          description: "Не удалось инициализировать WebContainer"
        });
      }
    };

    initContainer();

    // Очищаем WebContainer при размонтировании компонента
    return () => {
      destroyWebContainer().catch(error => {
        console.error('Error destroying WebContainer:', error);
      });
    };
  }, []);

  const handleAIResponse = async (data: AIResponse) => {
    if (data.action === 'create_file' && data.filename) {
      try {
        await createFile(data.filename, data.content);
        const url = `webcontainer://${data.filename}`;
        setFileUrl(url);
        toast({
          title: "Файл создан",
          description: `Создан файл ${data.filename}`
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось создать файл"
        });
      }
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

      const data: AIResponse = await response.json();
      const aiMessage: Message = {
        role: 'assistant',
        content: data.content
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setInput('');
      
      await handleAIResponse(data);
      
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