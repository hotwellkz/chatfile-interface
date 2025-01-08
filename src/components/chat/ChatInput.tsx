import { Textarea } from "../ui/textarea";
import { FilePreview } from "../FilePreview";

interface ChatInputProps {
  input: string;
  files: File[];
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent<HTMLTextAreaElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLTextAreaElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLTextAreaElement>) => void;
  onRemoveFile: (index: number) => void;
}

export const ChatInput = ({
  input,
  files,
  isLoading,
  onInputChange,
  onKeyPress,
  onPaste,
  onDrop,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onRemoveFile,
}: ChatInputProps) => {
  return (
    <div className="flex-1">
      <Textarea
        value={input}
        onChange={onInputChange}
        onKeyDown={onKeyPress}
        onPaste={onPaste}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        placeholder="Введите сообщение..."
        style={{
          minHeight: 150,
          maxHeight: 400
        }}
        className="resize-none transition-all duration-200 hover:border-primary"
        disabled={isLoading}
      />
      <FilePreview
        files={files}
        onRemove={onRemoveFile}
      />
    </div>
  );
};