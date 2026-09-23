import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { translate } from '../utils/translate';


const useTranslate = (text) => {
  const { lang } = useLang();
  const [result, setResult] = useState(text || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!text) {
      setResult('');
      return;
    }
    if (lang === 'en') {
      setResult(text);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    translate(text, 'hi').then(translated => {
      if (!cancelled) {
        setResult(translated);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [text, lang]);

  return { text: result, loading };
};

export default useTranslate;
