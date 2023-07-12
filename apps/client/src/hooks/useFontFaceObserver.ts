import FontFaceObserver from 'fontfaceobserver';
import { useLayoutEffect, useState } from 'react';

function useFontFaceObserver(fontFamily: string): {
  success: boolean;
  loading: boolean;
  error: boolean;
} {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useLayoutEffect(() => {
    const observeFontFaceLoad = (observer: FontFaceObserver) => {
      observer
        .load()
        .then(() => {
          setSuccess(true);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    };

    const observer = new FontFaceObserver(fontFamily);
    observeFontFaceLoad(observer);
  }, []);

  return { success, loading, error };
}

export default useFontFaceObserver;
