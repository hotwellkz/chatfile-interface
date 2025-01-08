import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer | null = null;

/**
 * Инициализирует экземпляр WebContainer если он еще не создан
 */
export async function initWebContainer() {
  if (!webcontainerInstance) {
    try {
      webcontainerInstance = await WebContainer.boot();
      console.log('WebContainer initialized successfully');
    } catch (error) {
      console.error('Error initializing WebContainer:', error);
      throw error;
    }
  }
  return webcontainerInstance;
}

/**
 * Создает файл с указанным именем и содержимым
 * @param name - имя файла
 * @param content - содержимое файла
 */
export async function createFile(name: string, content: string) {
  try {
    console.log('Creating file:', name, 'with content:', content);
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
 * @param name - имя файла
 * @returns содержимое файла в виде строки
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
  webcontainerInstance = null;
  console.log('WebContainer instance cleared');
}