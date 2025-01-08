import { useChat } from "./chat/useChat";
import { useFileHandling } from "./chat/useFileHandling";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatControls } from "./chat/ChatControls";
import { ChatHeader } from "./chat/ChatHeader";
import { FilePreview } from "./FilePreview";
import { MODEL_LIST } from '@/utils/constants';

interface ChatProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function Chat({ apiKey, onApiKeyChange }: ChatProps) {
  const {
    messages,
    input,
    setInput,
    isLoading,
    model,
    setModel,
    sendMessage
  } = useChat();

  const {
    files,
    handleFileUpload,
    handlePaste,
    handleDrop,
    removeFile
  } = useFileHandling();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        model={model}
        setModel={setModel}
        provider={{ 
          name: 'openai', 
          label: 'OpenAI',
          models: MODEL_LIST
        }}
        apiKey={apiKey}
        onApiKeyChange={onApiKeyChange}
      />

      <ChatMessages messages={messages} />

      <div className="p-4 border-t border-border">
        <FilePreview
          files={files}
          onRemove={removeFile}
        />

        <div className="flex gap-2">
          <div className="flex-1">
            <ChatInput
              input={input}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onSendMessage={sendMessage}
              onPaste={handlePaste}
              onDrop={handleDrop}
            />
          </div>
          
          <ChatControls
            onSendMessage={sendMessage}
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
            hasInput={input.trim().length > 0 || files.length > 0}
            onTranscript={setInput}
          />
        </div>

        {input.length > 3 && (
          <div className="mt-2 text-xs text-muted-foreground text-right">
            Нажмите Shift + Enter для новой строки
          </div>
        )}
      </div>
    </div>
  );
}