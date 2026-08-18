import { create } from 'zustand';
import { translations, Language } from './translations';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'uz',
  setLanguage: (lang: Language) => set({ language: lang }),
}));

export function useTranslation() {
  const { language, setLanguage } = useLanguageStore();

  const t = (key: keyof typeof translations['uz']): string => {
    const langDict = translations[language] || translations.uz;
    return langDict[key] || translations.uz[key] || String(key);
  };

  const formatEnum = (prefix: string, value: string): string => {
    if (!value) return '';
    const key = `${prefix}${value}` as keyof typeof translations['uz'];
    return t(key) || value;
  };

  return {
    t,
    formatEnum,
    language,
    setLanguage,
  };
}
