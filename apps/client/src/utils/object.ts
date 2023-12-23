import { isArray, isObject } from './is';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ObjectWithAnyProperties = Record<string, any>;

export function deepMerge<T extends ObjectWithAnyProperties>(
  target: T,
  source: T,
) {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  const result = { ...target, ...source } as ObjectWithAnyProperties;

  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isArray(targetValue) && isArray(sourceValue)) {
      result[key as keyof ObjectWithAnyProperties] =
        targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      result[key] = deepMerge({ ...targetValue }, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  }

  return result as T;
}

export function safeJSONParse<T = unknown>(text: string) {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    return null;
  }
}
