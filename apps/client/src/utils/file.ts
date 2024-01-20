import { type AppState, PROJECT_FILE_EXT, appState } from '@/constants/app';
import { safeJSONParse } from './object';

export function downloadDataUrlAsFile(
  dataUrl: string,
  name: string,
  ext: string,
) {
  const link = document.createElement('a');

  link.setAttribute('href', dataUrl);
  link.setAttribute('download', `${name}.${ext}`);

  link.click();
  link.remove();
}

export function getUserSelectedFile(type: string) {
  return new Promise((resolve: (file: File | null) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = `.${type}`;

    input.click();

    input.addEventListener('change', () => {
      return resolve(input.files?.[0] || null);
    });
  });
}

export function readUserSelectedFileAsText(file: File) {
  return new Promise((resolve: (contents: string | null) => void) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      return resolve(typeof reader.result === 'string' ? reader.result : null);
    });

    reader.readAsText(file);
  });
}

export async function importProject() {
  try {
    const file = await getUserSelectedFile(PROJECT_FILE_EXT);

    const fileContents = file && (await readUserSelectedFileAsText(file));

    if (!fileContents || !isJsonString(fileContents)) return null;

    const data = safeJSONParse<Partial<AppState>>(fileContents);

    return await appState.shape.page.partial().parseAsync(data);
  } catch (error) {
    return null;
  }
}

export function isJsonString(string: string) {
  if (typeof string !== 'string') {
    return false;
  }

  try {
    JSON.parse(string);
    return true;
  } catch (error) {
    return false;
  }
}
