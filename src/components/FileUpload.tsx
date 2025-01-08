import { Button } from "./ui/button";
import { Paperclip, X } from "lucide-react";

interface FileUploadProps {
  files: File[];
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export const FileUpload = ({ files, onUpload, onRemove }: FileUploadProps) => {
  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = (e) => {
      const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
      onUpload(selectedFiles);
    };

    input.click();
  };

  return (
    <div className="w-full">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleFileUpload}
        className="mb-2"
      >
        <Paperclip className="w-4 h-4 mr-2" />
        Прикрепить файл
      </Button>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 bg-secondary p-2 rounded"
            >
              <span className="text-sm">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};