import type { ProviderInfo } from '@/types';

export const MAX_RESPONSE_SEGMENTS = 5;
export const MAX_TOKENS = 4096;
export const CONTINUE_PROMPT = "Please continue from where you left off.";

export const MODEL_LIST = [
  'gpt-4o',
  'gpt-4o-mini'
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