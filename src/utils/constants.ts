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