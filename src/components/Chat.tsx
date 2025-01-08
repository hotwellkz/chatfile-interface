import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ModelSelector } from "./ModelSelector";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatControls } from "./chat/ChatControls";
import { FilePreview } from "./FilePreview";
import { ExamplePrompts } from "./chat/ExamplePrompts";
import { APIKeyManager } from "./chat/APIKeyManager";
import { MODEL_LIST, PROVIDER_LIST, initializeModelList } from '@/utils/constants';
import type { Message, ProviderInfo } from '@/types';
import Cookies from 'js-cookie';

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('gpt-4o');
  const [files, setFiles] = useState<File[]>([]);
  const [provider, setProvider] = useState<ProviderInfo>(PROVIDER_LIST[0]);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [modelList, setModelList] = useState(MODEL_LIST);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const handleFileSelect = () => {
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <ChatMessages messages={messages} />
      </div>

      <div className="p-4 border-t border-border">
        <ModelSelector 
          model={model} 
          setModel={setModel}
          modelList={modelList}
          provider={provider}
          setProvider={setProvider}
          providerList={PROVIDER_LIST}
          apiKeys={apiKeys}
        />

        {provider && (
          <APIKeyManager
            provider={provider}
            apiKey={apiKeys[provider.name] || ''}
            setApiKey={(key) => updateApiKey(provider.name, key)}
          />
        )}

        <FilePreview
          files={files}
          onRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
        />

        <div className="flex gap-2 mt-4">
          <ChatInput
            ref={textareaRef}
            input={input}
            files={files}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSend={sendMessage}
          />
          <ChatControls
            onSend={sendMessage}
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
          />
        </div>

        {!messages.length && (
          <ExamplePrompts handlePrompt={(e, prompt) => {
            setInput(prompt);
            sendMessage();
          }} />
        )}
      </div>
    </div>
  );
}