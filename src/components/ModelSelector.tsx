import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Model, ProviderInfo } from '@/types';

interface ModelSelectorProps {
  model: string;
  setModel: (model: string) => void;
  modelList: Model[];
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  providerList: ProviderInfo[];
  apiKeys: Record<string, string>;
}

export const ModelSelector = ({ 
  model, 
  setModel,
  modelList,
  provider,
  setProvider,
  providerList,
  apiKeys 
}: ModelSelectorProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Select value={model} onValueChange={setModel}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Выберите модель" />
        </SelectTrigger>
        <SelectContent>
          {modelList.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {providerList.length > 1 && (
        <Select 
          value={provider?.name} 
          onValueChange={(value) => {
            const newProvider = providerList.find(p => p.name === value);
            if (newProvider && setProvider) {
              setProvider(newProvider);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите провайдера" />
          </SelectTrigger>
          <SelectContent>
            {providerList.map((p) => (
              <SelectItem 
                key={p.name} 
                value={p.name}
                disabled={!apiKeys[p.name]}
              >
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};