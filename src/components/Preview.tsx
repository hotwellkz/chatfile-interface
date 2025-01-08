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
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-border flex items-center justify-between">
        <a href="#" className="text-sm text-primary hover:underline">
          preview.lovable.dev
        </a>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 bg-background">
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