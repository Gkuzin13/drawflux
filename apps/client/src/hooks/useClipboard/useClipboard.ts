import { useState } from 'react';

function useClipboard({ timeout = 2000 } = {}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [copyTimeout, setCopyTimeout] = useState<NodeJS.Timeout>();

  function copy(text: string) {
    if ('clipboard' in navigator) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          clearTimeout(copyTimeout);
          setCopyTimeout(setTimeout(() => setCopied(false), timeout));
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
    clearTimeout(copyTimeout);
  }

  return { copied, error, copy, reset };
}

export default useClipboard;
