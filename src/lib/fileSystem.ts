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
 */
export async function createFile(name: string, content: string) {
  try {
    const container = await initWebContainer();
    await container.fs.writeFile(name, content);
  } catch (error) {
    console.error('Ошибка при создании файла:', error);
    throw error;
  }
}

/**
 * Читает содержимое файла по указанному имени
 */
export async function readFile(name: string): Promise<string> {
  try {
    const container = await initWebContainer();
    const fileContent = await container.fs.readFile(name, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error('Ошибка при чтении файла:', error);
    throw error;
  }
}

/**
 * Проверяет существование файла
 */
export async function fileExists(name: string): Promise<boolean> {
  try {
    const container = await initWebContainer();
    await container.fs.readFile(name, 'utf-8');
    return true;
  } catch {
    return false;
  }
}