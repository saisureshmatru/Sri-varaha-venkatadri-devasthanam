'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function BilingualHtml({ en, te }) {
  const { language } = useLanguage();
  const content = (language === 'te' && te) ? te : (en || '');
  
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
