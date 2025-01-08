import { Send, Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import { SpeechRecognition } from "../SpeechRecognition";

interface ChatControlsProps {
  onSend: () => void;
  onFileUpload: () => void;
  onTranscript: (text: string) => void;
  isLoading: boolean;
}

export const ChatControls = ({
  onSend,
  onFileUpload,
  onTranscript,
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
        onClick={onFileUpload}
        className="hover:bg-accent"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      <SpeechRecognition onTranscript={onTranscript} />
    </div>
  );
};