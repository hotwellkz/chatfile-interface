import { Button } from "../ui/button";
import { Send, Loader2 } from "lucide-react";

interface SendButtonProps {
  show: boolean;
  isStreaming: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export const SendButton = ({ show, isStreaming, onClick }: SendButtonProps) => {
  if (!show) return null;

  return (
    <Button
      className="absolute right-2 bottom-[60px]"
      size="icon"
      onClick={onClick}
    >
      {isStreaming ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
    </Button>
  );
};