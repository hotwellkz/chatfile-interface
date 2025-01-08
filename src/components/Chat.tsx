import { useState, useEffect, RefCallback } from 'react';
import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ModelSelector } from "./ModelSelector";
import { FilePreview } from "./FilePreview";
import { SpeechRecognition } from "./SpeechRecognition";
import Cookies from 'js-cookie';
import { initializeModelList, MODEL_LIST, PROVIDER_LIST } from '~/utils/constants';
import { APIKeyManager } from './APIKeyManager';
import { ExamplePrompts } from './ExamplePrompts';

const TEXTAREA_MIN_HEIGHT = 150;
const TEXTAREA_MAX_HEIGHT = 400;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  description?: string;
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  model?: string;
  setModel?: (model: string) => void;
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
  importChat?: (description: string, messages: Message[]) => Promise<void>;
  exportChat?: () => void;
  uploadedFiles?: File[];
  setUploadedFiles?: (files: File[]) => void;
  imageDataList?: string[];
  setImageDataList?: (dataList: string[]) => void;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('gpt-4');
  const [files, setFiles] = useState<File[]>([]);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [modelList, setModelList] = useState(MODEL_LIST);
  const [isModelSettingsCollapsed, setIsModelSettingsCollapsed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    const storedApiKeys = Cookies.get('apiKeys');
    if (storedApiKeys) {
      const parsedKeys = JSON.parse(storedApiKeys);
      if (typeof parsedKeys === 'object' && parsedKeys !== null) {
        setApiKeys(parsedKeys);
      }
    }
    initializeModelList().then((modelList) => {
      setModelList(modelList);
    });
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setTranscript(transcript);
        if (handleInputChange) {
          const syntheticEvent = {
            target: { value: transcript },
          } as React.ChangeEvent<HTMLTextAreaElement>;
          handleInputChange(syntheticEvent);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognition);
    }
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSpeechTranscript = (text: string) => {
    setInput(text);
    setTranscript(text);
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

  const handleDragEnter = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    (e.target as HTMLTextAreaElement).style.border = '2px solid #1488fc';
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    (e.target as HTMLTextAreaElement).style.border = '2px solid #1488fc';
  };

  const handleDragLeave = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    (e.target as HTMLTextAreaElement).style.border = '1px solid var(--border)';
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
        <ModelSelector model={model} setModel={setModel} />

        <FilePreview
          files={files}
          onRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
        />

        <div className="flex gap-2 mt-4">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              placeholder="Введите сообщение..."
              style={{
                minHeight: TEXTAREA_MIN_HEIGHT,
                maxHeight: TEXTAREA_MAX_HEIGHT
              }}
              className="resize-none transition-all duration-200 hover:border-primary"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
                  setFiles(prev => [...prev, ...selectedFiles]);
                };
                input.click();
              }}
              className="hover:bg-accent"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <SpeechRecognition onTranscript={handleSpeechTranscript} />
          </div>
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
