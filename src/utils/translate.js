// In-memory translation cache to avoid duplicate API calls
const cache = new Map();

/**
 * Translates a single text chunk (≤900 chars) using the
 * unofficial Google Translate endpoint (no API key needed).
 */
const translateChunk = async (text, targetLang) => {
  const key = `${targetLang}::${text}`;
  if (cache.has(key)) return cache.get(key);

  try {
    const url =
      `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();

    // data[0] = array of [translatedSegment, originalSegment, ...]
    const translated = data[0]
      .map(seg => seg[0])
      .filter(Boolean)
      .join('');

    cache.set(key, translated);
    return translated;
  } catch {
    return text; // fallback to original on error
  }
};

/**
 * Translates any length of text to the target language.
 * Long text is split at sentence boundaries to avoid URL length limits.
 */
export const translate = async (text, targetLang = 'hi') => {
  if (!text || !text.trim() || targetLang === 'en') return text;

  const MAX = 900;
  if (text.length <= MAX) return translateChunk(text, targetLang);

  // Split into sentence-boundary chunks
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
  const chunks = [];
  let current = '';

  for (const s of sentences) {
    if ((current + s).length > MAX && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  const results = await Promise.all(
    chunks.map(c => translateChunk(c, targetLang))
  );
  return results.join(' ');
};
