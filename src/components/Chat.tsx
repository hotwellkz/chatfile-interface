import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ModelSelector } from "./ModelSelector";
import { FilePreview } from "./FilePreview";
import { SpeechRecognition } from "./SpeechRecognition";
import { supabase } from "@/integrations/supabase/client";
import { ExamplePrompts } from './ExamplePrompts';

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
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [modelList, setModelList] = useState(MODEL_LIST);
  const [isModelSettingsCollapsed, setIsModelSettingsCollapsed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

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
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Не авторизован')

      const response = await supabase.functions.invoke('chat', {
        body: {
          messages: [...messages, userMessage],
          model,
        },
      })

      if (response.error) {
        throw new Error(response.error.message || 'Ошибка при отправке сообщения')
      }

      const reader = response.data.getReader()
      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = new TextDecoder().decode(value)
        accumulatedContent += text

        setMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = accumulatedContent
          } else {
            newMessages.push({
              role: 'assistant',
              content: accumulatedContent
            })
          }
          
          return newMessages
        })
      }

      setInput('')
      setFiles([])

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : 'Произошла ошибка при отправке сообщения'
      })
    } finally {
      setIsLoading(false)
    }
  }

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
              onChange={handleInputChange}
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
