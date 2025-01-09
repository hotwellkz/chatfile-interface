import { Textarea } from "../ui/textarea";
import { useState, useEffect } from "react";
import { TEXTAREA_MIN_HEIGHT, TEXTAREA_MAX_HEIGHT } from "@/utils/constants";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const ChatInput = ({
  input,
  isLoading,
  onInputChange,
  onSend,
  onPaste,
  onDrop
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
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
      onChange={(e) => onInputChange(e.target.value)}
      onKeyDown={handleKeyPress}
      onPaste={onPaste}
      onDrop={onDrop}
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
  );
};