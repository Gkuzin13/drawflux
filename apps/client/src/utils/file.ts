import { type ZodSchema } from 'zod';

export type ImportFileType = 'json';

export function downloadDataUrlAsFile(dataUrl: string, fileName: string) {
  const link = document.createElement('a');

  link.setAttribute('href', dataUrl);
  link.setAttribute('download', fileName);

  link.click();
  link.remove();
}

export function getUserSelectedFile(type: ImportFileType) {
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

export async function loadJsonFile<T>(schema: ZodSchema) {
  const file = await getUserSelectedFile('json');

  if (!file) {
    return null;
  }

  const fileContents = await readUserSelectedFileAsText(file);

  if (!fileContents || !isJsonString(fileContents)) return null;

  const data = JSON.parse(fileContents);

  try {
    schema.parse(data);
    return data as T;
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
