import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Cookies from 'js-cookie';
import { MODEL_LIST, PROVIDER_LIST, initializeModelList } from '@/utils/constants';
import type { Message, ProviderInfo } from '@/types';
import { ChatInterface } from './ChatInterface';

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('gpt-4o');
  const [files, setFiles] = useState<File[]>([]);
  const [provider, setProvider] = useState<ProviderInfo>(PROVIDER_LIST[0]);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [modelList, setModelList] = useState(MODEL_LIST);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedApiKeys = Cookies.get('apiKeys');
      if (storedApiKeys) {
        const parsedKeys = JSON.parse(storedApiKeys);
        if (typeof parsedKeys === 'object' && parsedKeys !== null) {
          setApiKeys(parsedKeys);
        }
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
      Cookies.remove('apiKeys');
    }

    initializeModelList().then(setModelList);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() && files.length === 0) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeys[provider.name]}`
        },
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
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : 'Произошла ошибка при отправке сообщения'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateApiKey = (provider: string, key: string) => {
    const updatedApiKeys = { ...apiKeys, [provider]: key };
    setApiKeys(updatedApiKeys);
    Cookies.set('apiKeys', JSON.stringify(updatedApiKeys), {
      expires: 30,
      secure: true,
      sameSite: 'strict',
    });
  };

  return (
    <ChatInterface 
      messages={messages}
      input={input}
      setInput={setInput}
      isLoading={isLoading}
      model={model}
      setModel={setModel}
      files={files}
      setFiles={setFiles}
      provider={provider}
      setProvider={setProvider}
      apiKeys={apiKeys}
      modelList={modelList}
      onSendMessage={sendMessage}
      onUpdateApiKey={updateApiKey}
    />
  );
}