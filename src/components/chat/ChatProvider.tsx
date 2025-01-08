import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Chat } from './Chat';

export function ChatProvider() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedApiKeys = Cookies.get('apiKeys');
    if (storedApiKeys) {
      const parsedKeys = JSON.parse(storedApiKeys);
      if (typeof parsedKeys === 'object' && parsedKeys !== null) {
        setApiKeys(parsedKeys);
      }
    }
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKeys(prev => ({ ...prev, openai: key }));
    Cookies.set('apiKeys', JSON.stringify({ ...apiKeys, openai: key }));
  };

  return (
    <Chat 
      apiKey={apiKeys['openai'] || ''} 
      onApiKeyChange={handleApiKeyChange} 
    />
  );
}