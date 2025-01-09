export const MAX_RESPONSE_SEGMENTS = 5;
export const MAX_TOKENS = 4096;
export const CONTINUE_PROMPT = 'Please continue from where you left off.';

// Textarea constants
export const TEXTAREA_MIN_HEIGHT = 80;
export const TEXTAREA_MAX_HEIGHT = 200;

// Model constants
export const MODEL_LIST = [
  { id: 'gpt-4o', name: 'GPT-4' },
  { id: 'gpt-4o-mini', name: 'GPT-4 Mini' }
];

export const initializeModelList = async () => {
  return MODEL_LIST;
};