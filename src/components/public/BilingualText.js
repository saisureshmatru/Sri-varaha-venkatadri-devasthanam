'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function BilingualText({ en, te }) {
  const { lang } = useLanguage();
  return <>{(lang === 'te' && te) ? te : (en || '')}</>;
}
