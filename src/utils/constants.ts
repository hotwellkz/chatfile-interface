export const MAX_RESPONSE_SEGMENTS = 5;
export const MAX_TOKENS = 1000;
export const CONTINUE_PROMPT = "Please continue from where you left off.";

export interface Model {
  id: string;
  name: string;
}

export const MODEL_LIST: Model[] = [
  { id: 'gpt-4o', name: 'GPT-4' },
  { id: 'gpt-4o-mini', name: 'GPT-4 Mini' }
];

export const PROVIDER_LIST = [
  {
    name: 'openai',
    label: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini']
  }
];

export const initializeModelList = async (): Promise<Model[]> => {
  return MODEL_LIST;
};