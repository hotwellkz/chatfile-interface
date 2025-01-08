import { useState, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ModelSelector } from "./ModelSelector";
import { FileUpload } from "./FileUpload";
import { SpeechRecognition } from "./SpeechRecognition";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('gpt-4');
  const [files, setFiles] = useState<File[]>([]);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
        
        <div className="flex gap-2 mt-4">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              placeholder="Введите сообщение..."
              className="min-h-[150px] resize-none"
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
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput instanceof HTMLInputElement) {
                  fileInput.click();
                }
              }}
              className="hover:bg-accent"
            >
              <Paperclip className="h-4 w-4" />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files || []);
                  setFiles(prev => [...prev, ...selectedFiles]);
                }}
              />
            </Button>
            <SpeechRecognition onTranscript={handleSpeechTranscript} />
          </div>
        </div>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((file, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-secondary p-2 rounded"
              >
                <span className="text-sm">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                >
                  <span className="sr-only">Удалить файл</span>
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}