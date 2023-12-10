import { useState } from 'react';
import useRefValue from '../useRefValue/useRefValue';

function useClipboard(resetTimeout = 2000) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [timeoutId, setTimeoutId] = useRefValue(0);

  function copy(text: string) {
    if ('clipboard' in navigator) {
      window.navigator.clipboard
        .writeText(text)
        .then(() => {
          clearTimeout(timeoutId.current);

          setTimeoutId(
            window.setTimeout(() => {
              setCopied(false);
              error && setError(null);
            }, resetTimeout),
          );

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
    clearTimeout(timeoutId.current);
  }

  return { copied, error, copy, reset };
}

export default useClipboard;
