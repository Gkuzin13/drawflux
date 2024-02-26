import type Konva from 'konva';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Konva: typeof Konva;
  }
}
