import { ChevronRight, File, Folder, Plus, Download, Edit, Trash } from "lucide-react";
import { Button } from "./ui/button";

export const FileExplorer = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-border flex items-center justify-between">
        <span className="text-sm font-medium">Files</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm hover:bg-accent p-1 rounded cursor-pointer">
            <ChevronRight className="h-4 w-4" />
            <Folder className="h-4 w-4" />
            <span>src</span>
          </div>
          <div className="flex items-center gap-2 text-sm hover:bg-accent p-1 rounded cursor-pointer ml-4">
            <File className="h-4 w-4" />
            <span>App.tsx</span>
          </div>
        </div>
      </div>
    </div>
  );
};