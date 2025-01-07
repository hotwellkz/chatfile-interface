import { Paperclip, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

export const ChatPanel = () => {
  const [prompt, setPrompt] = useState("");
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Chat messages would go here */}
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              className="min-h-[60px] resize-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm">Node.js</Button>
          <Button variant="outline" size="sm">React</Button>
          <Button variant="outline" size="sm">Vue</Button>
        </div>
      </div>
    </div>
  );
};