import { useState } from 'react';

export function useFileHandling() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
      setFiles(prev => [...prev, ...selectedFiles]);
    };
    input.click();
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setFiles(prev => [...prev, file]);
        }
        break;
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prev => [...prev, ...imageFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return {
    files,
    setFiles,
    handleFileUpload,
    handlePaste,
    handleDrop,
    removeFile
  };
}