import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer | null = null;
let isInitializing = false;

/**
 * Инициализирует экземпляр WebContainer если он еще не создан
 */
export async function initWebContainer() {
  if (isInitializing) {
    console.log('WebContainer initialization already in progress...');
    return webcontainerInstance;
  }

  if (!webcontainerInstance) {
    try {
      isInitializing = true;
      console.log('Initializing new WebContainer instance...');
      webcontainerInstance = await WebContainer.boot();
      console.log('WebContainer initialized successfully');
    } catch (error) {
      console.error('Error initializing WebContainer:', error);
      throw error;
    } finally {
      isInitializing = false;
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
    const container = await initWebContainer();
    if (!container) {
      throw new Error('WebContainer not initialized');
    }
    console.log(`Creating file: ${name} with content: ${content}`);
    await container.fs.writeFile(name, content);
    console.log(`File ${name} created successfully.`);
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
    if (!container) {
      throw new Error('WebContainer not initialized');
    }
    const fileContent = await container.fs.readFile(name, 'utf-8');
    console.log('File content read successfully:', fileContent);
    return fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

/**
 * Очищает и уничтожает экземпляр WebContainer
 */
export async function destroyWebContainer() {
  if (webcontainerInstance) {
    try {
      console.log('Destroying WebContainer instance...');
      await webcontainerInstance.teardown();
      webcontainerInstance = null;
      console.log('WebContainer instance successfully destroyed.');
    } catch (error) {
      console.error('Error destroying WebContainer:', error);
      throw error;
    }
  } else {
    console.log('No WebContainer instance to destroy.');
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