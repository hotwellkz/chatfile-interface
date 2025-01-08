import { forwardRef } from "react";
import { Textarea } from "../ui/textarea";
import { FilePreview } from "../FilePreview";

interface ChatInputProps {
  input: string;
  files: File[];
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ input, files, isLoading, onInputChange, onSend }, ref) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    };

    return (
      <div className="flex-1">
        <Textarea
          ref={ref}
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Введите сообщение..."
          style={{
            minHeight: 150,
            maxHeight: 400
          }}
          className="resize-none transition-all duration-200 hover:border-primary"
          disabled={isLoading}
        />
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";