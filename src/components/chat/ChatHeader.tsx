import { ModelSelector } from "../ModelSelector";
import { APIKeyManager } from "../APIKeyManager";
import { ProviderInfo } from "@/types";

interface ChatHeaderProps {
  model: string;
  setModel: (model: string) => void;
  provider?: ProviderInfo;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const ChatHeader = ({
  model,
  setModel,
  provider,
  apiKey,
  onApiKeyChange
}: ChatHeaderProps) => {
  return (
    <div className="mb-4">
      <ModelSelector model={model} setModel={setModel} />
      {provider && (
        <APIKeyManager
          provider={provider}
          apiKey={apiKey}
          setApiKey={onApiKeyChange}
        />
      )}
    </div>
  );
};