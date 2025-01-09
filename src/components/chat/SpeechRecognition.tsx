import { Button } from "../ui/button";
import { Mic, MicOff } from "lucide-react";

interface SpeechRecognitionButtonProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const SpeechRecognitionButton = ({ 
  isListening, 
  onStart, 
  onStop, 
  disabled 
}: SpeechRecognitionButtonProps) => {
  return (
    <Button
      variant={isListening ? "destructive" : "ghost"}
      size="icon"
      onClick={isListening ? onStop : onStart}
      disabled={disabled}
      className="hover:bg-accent"
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};