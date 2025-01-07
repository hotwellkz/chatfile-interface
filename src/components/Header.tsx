import { Menu, MessageSquare, History, LogIn } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="h-12 border-b border-border bg-card flex items-center px-4 justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <History className="h-4 w-4" />
        </Button>
      </div>
      
      <h1 className="text-sm font-medium">My Project</h1>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Guest</span>
        <Button variant="ghost" size="icon">
          <LogIn className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};