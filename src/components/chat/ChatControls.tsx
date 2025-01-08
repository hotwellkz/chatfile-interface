import { Send, Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import { SpeechRecognition } from "../SpeechRecognition";

interface ChatControlsProps {
  onSendMessage: () => void;
  onFileUpload: () => void;
  isLoading: boolean;
  hasInput: boolean;
  onTranscript: (text: string) => void;
}

export const ChatControls = ({
  onSendMessage,
  onFileUpload,
  isLoading,
  hasInput,
  onTranscript
}: ChatControlsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        size="icon"
        onClick={onSendMessage}
        disabled={isLoading || !hasInput}
      >
        <Send className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onFileUpload}
        className="hover:bg-accent"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      <SpeechRecognition onTranscript={onTranscript} />
    </div>
  );
};