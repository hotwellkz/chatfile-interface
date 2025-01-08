import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import { FileExplorer } from "@/components/FileExplorer";
import Preview from "@/components/Preview";
import { useState } from "react";

const Index = () => {
  const [chatWidth, setChatWidth] = useState(300);
  const [explorerWidth, setExplorerWidth] = useState(250);
  
  const handleChatResize = (e: MouseEvent) => {
    const newWidth = e.clientX;
    if (newWidth > 200 && newWidth < 600) {
      setChatWidth(newWidth);
    }
  };
  
  const handleExplorerResize = (e: MouseEvent) => {
    const newWidth = e.clientX - chatWidth;
    if (newWidth > 200 && newWidth < 400) {
      setExplorerWidth(newWidth);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <div
          className="panel flex-none"
          style={{ width: chatWidth }}
        >
          <ChatPanel />
        </div>
        
        <div
          className="resizer"
          onMouseDown={(e) => {
            e.preventDefault();
            document.addEventListener("mousemove", handleChatResize);
            document.addEventListener("mouseup", () => {
              document.removeEventListener("mousemove", handleChatResize);
            }, { once: true });
          }}
        />
        
        <div
          className="panel flex-none"
          style={{ width: explorerWidth }}
        >
          <FileExplorer />
        </div>
        
        <div
          className="resizer"
          onMouseDown={(e) => {
            e.preventDefault();
            document.addEventListener("mousemove", handleExplorerResize);
            document.addEventListener("mouseup", () => {
              document.removeEventListener("mousemove", handleExplorerResize);
            }, { once: true });
          }}
        />
        
        <div className="panel flex-1">
          <Preview />
        </div>
      </div>
    </div>
  );
};

export default Index;
