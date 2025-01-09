export interface ProviderInfo {
  name: string;
  label: string;
  models: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}