import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatControls } from "./chat/ChatControls";
import { ChatHeader } from "./chat/ChatHeader";
import { FilePreview } from "./FilePreview";
import { ExamplePrompts } from "./ExamplePrompts";
import Cookies from 'js-cookie';
import { initializeModelList } from '@/utils/constants';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('gpt-4');
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedApiKeys = Cookies.get('apiKeys');
    if (storedApiKeys) {
      const parsedKeys = JSON.parse(storedApiKeys);
      if (typeof parsedKeys === 'object' && parsedKeys !== null) {
        setApiKeys(parsedKeys);
      }
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const sendMessage = async () => {
    if (!input.trim() && files.length === 0) return;

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
          messages: [...messages, userMessage],
          model,
          files: files.map(f => f.name)
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
      setFiles([]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : 'Произошла ошибка при отправке сообщения'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
      setFiles(prev => [...prev, ...selectedFiles]);
    };
    input.click();
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setFiles(prev => [...prev, file]);
        }
        break;
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prev => [...prev, ...imageFiles]);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        model={model}
        setModel={setModel}
        provider={{ name: 'openai', label: 'OpenAI' }}
        apiKey={apiKeys['openai'] || ''}
        onApiKeyChange={(key) => {
          setApiKeys(prev => ({ ...prev, openai: key }));
          Cookies.set('apiKeys', JSON.stringify({ ...apiKeys, openai: key }));
        }}
      />

      <ChatMessages messages={messages} />

      <div className="p-4 border-t border-border">
        <FilePreview
          files={files}
          onRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
        />

        <div className="flex gap-2">
          <div className="flex-1">
            <ChatInput
              input={input}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onSendMessage={sendMessage}
              onPaste={handlePaste}
              onDrop={handleDrop}
            />
          </div>
          
          <ChatControls
            onSendMessage={sendMessage}
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
            hasInput={input.trim().length > 0 || files.length > 0}
            onTranscript={setInput}
          />
        </div>

        {input.length > 3 && (
          <div className="mt-2 text-xs text-muted-foreground text-right">
            Нажмите Shift + Enter для новой строки
          </div>
        )}
      </div>
    </div>
  );
}