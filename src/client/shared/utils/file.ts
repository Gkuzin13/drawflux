export function downloadDataUrlAsFile(dataUrl: string, fileName: string) {
  const link = document.createElement('a');

  link.setAttribute('href', dataUrl);
  link.setAttribute('download', fileName);

  link.click();
  link.remove();
}
