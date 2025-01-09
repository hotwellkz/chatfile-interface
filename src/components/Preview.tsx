import React, { useEffect, useState } from 'react';
import { Maximize2, Smartphone, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { readFile } from "@/lib/fileSystem";

interface PreviewProps {
  fileUrl?: string;
}

const Preview = ({ fileUrl }: PreviewProps) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadFileContent = async () => {
      if (!fileUrl) return;
      
      setIsLoading(true);
      try {
        // Извлекаем имя файла из URL
        const filename = fileUrl.replace('webcontainer://', '');
        const fileContent = await readFile(filename);
        setContent(fileContent);
      } catch (error) {
        console.error('Error loading file:', error);
        setContent('Ошибка загрузки файла');
      } finally {
        setIsLoading(false);
      }
    };

    loadFileContent();
  }, [fileUrl]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="icon">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Загрузка...
          </div>
        ) : !fileUrl ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Файл ещё не создан
          </div>
        ) : (
          <div className="p-4">
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;