export function getFontSize(size: number) {
  return size * 8;
}

export function getStyle(fontSize: number, color: string): React.CSSProperties {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  const baseStyle: React.CSSProperties = {
    color,
    fontSize: `${fontSize}px`,
  };

  if (isFirefox) {
    return {
      ...baseStyle,
      transform: `translateY(-${fontSize / 16}px)`,
    };
  }

  return {
    ...baseStyle,
    transform: `translateY(-${fontSize / 18}px)`,
  };
}
