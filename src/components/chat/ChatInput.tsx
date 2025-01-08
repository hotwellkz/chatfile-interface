import { useState } from 'react';
import { Textarea } from "../ui/textarea";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const ChatInput = ({
  input,
  isLoading,
  onInputChange,
  onSendMessage,
  onPaste,
  onDrop
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
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
    <Textarea
      value={input}
      onChange={onInputChange}
      onKeyDown={handleKeyPress}
      onPaste={onPaste}
      onDrop={onDrop}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave}
      placeholder="Введите сообщение..."
      style={{
        minHeight: 150,
        maxHeight: 400
      }}
      className="resize-none transition-all duration-200 hover:border-primary"
      disabled={isLoading}
    />
  );
};