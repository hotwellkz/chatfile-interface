export const MAX_RESPONSE_SEGMENTS = 5;
export const MAX_TOKENS = 500;
export const CONTINUE_PROMPT = 'continue';

// Константы для текстового поля
export const TEXTAREA_MIN_HEIGHT = '60px';
export const TEXTAREA_MAX_HEIGHT = '200px';

// Список моделей и функция инициализации
export const MODEL_LIST = [
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-4-mini', name: 'GPT-4 Mini' }
];

export const initializeModelList = async () => {
  // В будущем здесь может быть логика динамической загрузки моделей
  return MODEL_LIST;
};