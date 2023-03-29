export function capitalizeFirstLetter(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

export const getKeyTitle = (name: string, keys: string[]) => {
  const capitalizedName = capitalizeFirstLetter(name);
  if (keys.length === 1) {
    return `${capitalizedName} — ${capitalizeFirstLetter(keys[0])}`;
  }
  return `${capitalizedName} — ${keys
    .map((key) => capitalizeFirstLetter(key.replace(/Key/, '')))
    .join(' + ')}`;
};

export function isJsonString(string: string) {
  try {
    JSON.parse(string);
    return true;
  } catch (error) {
    return false;
  }
}
