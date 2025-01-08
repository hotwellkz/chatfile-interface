import { useRef } from 'react';
import { ModelSelector } from "./ModelSelector";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ChatControls } from "./ChatControls";
import { FilePreview } from "../FilePreview";
import { ExamplePrompts } from "./ExamplePrompts";
import { APIKeyManager } from "./APIKeyManager";
import { PROVIDER_LIST } from "@/utils/constants";
import type { Message, ProviderInfo } from '@/types';

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  model: string;
  setModel: (model: string) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  provider: ProviderInfo;
  setProvider: (provider: ProviderInfo) => void;
  apiKeys: Record<string, string>;
  modelList: any[];
  onSendMessage: () => Promise<void>;
  onUpdateApiKey: (provider: string, key: string) => void;
}

export function ChatInterface({
  messages,
  input,
  setInput,
  isLoading,
  model,
  setModel,
  files,
  setFiles,
  provider,
  setProvider,
  apiKeys,
  modelList,
  onSendMessage,
  onUpdateApiKey
}: ChatInterfaceProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
      setFiles([...files, ...selectedFiles]);
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
            setApiKey={(key) => onUpdateApiKey(provider.name, key)}
          />
        )}

        <FilePreview
          files={files}
          onRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
        />

        <div className="flex gap-2 mt-4">
          <ChatInput
            input={input}
            files={files}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSend={onSendMessage}
          />
          <ChatControls
            onSend={onSendMessage}
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
            onTranscript={(text) => setInput(text)}
          />
        </div>

        {!messages.length && (
          <ExamplePrompts 
            handlePrompt={(e: React.MouseEvent, prompt: string) => {
              setInput(prompt);
              onSendMessage();
            }} 
          />
        )}
      </div>
    </div>
  );
}