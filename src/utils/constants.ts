import { ProviderInfo } from '@/types';

export const MODEL_LIST = [
  'gpt-4',
  'gpt-4-mini'
];

export const PROVIDER_LIST: ProviderInfo[] = [
  {
    name: 'openai',
    label: 'OpenAI',
    models: MODEL_LIST
  }
];

export const initializeModelList = async () => {
  return MODEL_LIST;
};