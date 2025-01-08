import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer | null = null;

/**
 * Инициализирует экземпляр WebContainer если он еще не создан
 */
export async function initWebContainer() {
  if (!webcontainerInstance) {
    webcontainerInstance = await WebContainer.boot();
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
    const container = await initWebContainer();
    await container.fs.writeFile(name, content);
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
    const container = await initWebContainer();
    const fileContent = await container.fs.readFile(name, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}