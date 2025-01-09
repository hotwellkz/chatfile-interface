import { Button } from "./ui/button";
import { X } from "lucide-react";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const FilePreview = ({ files, onRemove }: FilePreviewProps) => {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-4">
      {files.map((file, index) => (
        <div 
          key={index}
          className="flex items-center gap-2 bg-secondary p-2 rounded"
        >
          <span className="text-sm text-secondary-foreground">{file.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="h-5 w-5 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};