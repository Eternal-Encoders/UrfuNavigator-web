export const lngs = {
    en: 'English',
    ru: 'Русский',
    zh: '中文',
    ar: 'العربية'
} as const;

export type Lng = keyof typeof lngs;
