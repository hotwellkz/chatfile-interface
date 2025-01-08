import React from 'react';
import { Maximize2, Smartphone, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface PreviewProps {
  fileUrl?: string;
}

export const Preview = ({ fileUrl }: PreviewProps) => {
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
        {!fileUrl ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No preview available
          </div>
        ) : (
          <iframe 
            src={fileUrl} 
            className="w-full h-[400px]" 
            title="Preview"
          />
        )}
      </div>
    </div>
  );
};
