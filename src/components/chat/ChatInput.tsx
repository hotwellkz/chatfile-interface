import { Textarea } from "../ui/textarea";
import { FilePreview } from "../FilePreview";

export interface ChatInputProps {
  input: string;
  files: File[];
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => Promise<void>;
}

export const ChatInput = ({
  input,
  files,
  isLoading,
  onInputChange,
  onSend
}: ChatInputProps) => {
  return (
    <div className="flex-1">
      <Textarea
        value={input}
        onChange={onInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
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
        onRemove={(index) => {
          const newFiles = [...files];
          newFiles.splice(index, 1);
          // setFiles(newFiles);
        }}
      />
    </div>
  );
};
