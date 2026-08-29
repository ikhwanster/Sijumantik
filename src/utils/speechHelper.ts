/**
 * Helper untuk fitur panduan suara ramah lansia & ibu-ibu (Text-to-Speech Bahasa Indonesia)
 */

let isAudioEnabled = true;

export const setSpeechEnabled = (enabled: boolean) => {
  isAudioEnabled = enabled;
  if (!enabled && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const getSpeechEnabled = () => isAudioEnabled;

export const speakIndonesian = (text: string) => {
  if (!isAudioEnabled) return;
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95; // Slightly calmer, clearer pace for elderly
    utterance.pitch = 1.05; // Warm, friendly tone

    // Try to pick an Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find((v) => v.lang.includes('id') || v.lang.includes('ID'));
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis not available or blocked:', err);
  }
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
