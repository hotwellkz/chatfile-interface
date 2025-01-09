import { Button } from "../../ui/button";
import { Download } from "lucide-react";

interface ExportChatButtonProps {
  exportChat?: () => void;
}

export const ExportChatButton = ({ exportChat }: ExportChatButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={exportChat}
      className="hover:bg-accent"
    >
      <Download className="h-4 w-4" />
    </Button>
  );
};