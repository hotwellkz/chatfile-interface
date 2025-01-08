import { Button } from "../../ui/button";
import { Upload } from "lucide-react";

export const ImportButtons = (importChat?: (description: string, messages: any[]) => Promise<void>) => {
  if (!importChat) return null;

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          await importChat(content.description || '', content.messages || []);
        } catch (error) {
          console.error('Error importing chat:', error);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  return (
    <div className="flex justify-center gap-2 mb-4">
      <Button
        variant="outline"
        onClick={handleImport}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        Импортировать чат
      </Button>
    </div>
  );
};