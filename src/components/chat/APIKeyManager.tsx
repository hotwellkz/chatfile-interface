import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { ProviderInfo } from '@/types';

interface APIKeyManagerProps {
  provider: ProviderInfo;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const APIKeyManager = ({ provider, apiKey, setApiKey }: APIKeyManagerProps) => {
  const [isEditing, setIsEditing] = useState(!apiKey);

  return (
    <div className="mt-4 p-4 border border-border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">{provider.label} API Key</h3>
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Изменить
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="flex gap-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={`Введите ${provider.label} API ключ`}
            className="flex-1"
          />
          <Button 
            onClick={() => setIsEditing(false)}
            disabled={!apiKey}
          >
            Сохранить
          </Button>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          API ключ сохранен
        </div>
      )}
    </div>
  );
};