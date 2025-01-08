export interface ProviderInfo {
  name: string;
  label: string;
  models: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}