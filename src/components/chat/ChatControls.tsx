import { Button } from "../ui/button";
import { Send, Paperclip } from "lucide-react";

interface ChatControlsProps {
  onSend: () => void;
  onFileSelect: () => void;
  isLoading: boolean;
}

export const ChatControls = ({
  onSend,
  onFileSelect,
  isLoading
}: ChatControlsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        size="icon"
        onClick={onSend}
        disabled={isLoading}
      >
        <Send className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onFileSelect}
        className="hover:bg-accent"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
    </div>
  );
};