import { useRef, useState } from 'react';

function useClipboard(resetTimeout = 2000) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const timeoutRef = useRef<number>();

  function copy(text: string) {
    if ('clipboard' in navigator) {
      window.navigator.clipboard
        .writeText(text)
        .then(() => {
          clearTimeout(timeoutRef.current);

          timeoutRef.current = window.setTimeout(() => {
            setCopied(false);
            error && setError(null);
          }, resetTimeout);

          setCopied(true);
        })
        .catch(setError);
    } else {
      setError(
        new Error('useClipboard: navigator in clipboard is not supported'),
      );
    }
  }

  function reset() {
    setCopied(false);
    setError(null);
    clearTimeout(timeoutRef.current);
  }

  return { copied, error, copy, reset };
}

export default useClipboard;
