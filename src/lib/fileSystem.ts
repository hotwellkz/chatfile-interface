import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer | null = null;

/**
 * Инициализирует экземпляр WebContainer если он еще не создан
 */
export async function initWebContainer() {
  if (!webcontainerInstance) {
    try {
      console.log('Initializing new WebContainer instance...');
      webcontainerInstance = await WebContainer.boot();
      console.log('WebContainer initialized successfully');
    } catch (error) {
      console.error('Error initializing WebContainer:', error);
      throw error;
    }
  } else {
    console.log('Reusing existing WebContainer instance');
  }
  return webcontainerInstance;
}

/**
 * Создает файл с указанным именем и содержимым
 */
export async function createFile(name: string, content: string) {
  try {
    console.log('Creating file:', name, 'with content:', content);
    
    // Очищаем существующий экземпляр перед созданием нового файла
    clearWebContainer();
    
    const container = await initWebContainer();
    await container.fs.writeFile(name, content);
    console.log('File created successfully');
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

/**
 * Читает содержимое файла
 */
export async function readFile(name: string): Promise<string> {
  try {
    console.log('Reading file:', name);
    const container = await initWebContainer();
    const fileContent = await container.fs.readFile(name, 'utf-8');
    console.log('File content read successfully:', fileContent);
    return fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

/**
 * Очищает экземпляр WebContainer
 */
export function clearWebContainer() {
  if (webcontainerInstance) {
    console.log('Clearing WebContainer instance');
    webcontainerInstance = null;
  }
}