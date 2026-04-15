const GOOGLE_TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';

export const translateText = async (text, targetLang = 'en', sourceLang = 'ms') => {
  try {
    // Strip HTML tags for translation, preserve structure
    const plainText = text.replace(/<[^>]*>/g, '|||TAG|||');
    const chunks = plainText.split('|||TAG|||').filter(chunk => chunk.trim());

    if (chunks.length === 0) return text;

    // Translate each text chunk
    const translatedChunks = [];
    for (const chunk of chunks) {
      if (chunk.trim().length === 0) {
        translatedChunks.push(chunk);
        continue;
      }

      const params = new URLSearchParams({
        client: 'gtx',
        sl: sourceLang,
        tl: targetLang,
        dt: 't',
        q: chunk,
      });

      const response = await fetch(`${GOOGLE_TRANSLATE_URL}?${params}`);
      const data = await response.json();

      if (data && data[0]) {
        const translated = data[0].map(item => item[0]).join('');
        translatedChunks.push(translated);
      } else {
        translatedChunks.push(chunk);
      }
    }

    // Rebuild HTML with translated text
    let result = text;
    const originalChunks = text.replace(/<[^>]*>/g, '|||TAG|||').split('|||TAG|||').filter(c => c.trim());

    for (let i = 0; i < originalChunks.length && i < translatedChunks.length; i++) {
      if (originalChunks[i].trim()) {
        result = result.replace(originalChunks[i], translatedChunks[i]);
      }
    }

    return result;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

export const translatePlainText = async (text, targetLang = 'en', sourceLang = 'ms') => {
  try {
    const params = new URLSearchParams({
      client: 'gtx',
      sl: sourceLang,
      tl: targetLang,
      dt: 't',
      q: text,
    });

    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?${params}`);
    const data = await response.json();

    if (data && data[0]) {
      return data[0].map(item => item[0]).join('');
    }
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};
