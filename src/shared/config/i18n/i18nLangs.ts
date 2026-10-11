export const lngs = {
    en: 'English',
    ru: 'Русский'
} as const;

export type Lng = keyof typeof lngs;
