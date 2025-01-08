import type { ProviderInfo } from '@/types';

export const MAX_RESPONSE_SEGMENTS = 5;
export const MAX_TOKENS = 4096;
export const CONTINUE_PROMPT = "Please continue from where you left off.";

export const MODEL_LIST = [
  'gpt-4',
  'gpt-4-turbo-preview',
  'gpt-3.5-turbo'
];

export const PROVIDER_LIST: ProviderInfo[] = [
  {
    name: 'openai',
    label: 'OpenAI',
    models: MODEL_LIST
  }
];