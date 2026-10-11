import { useTranslation } from 'react-i18next';
import { lngs, type Lng } from '@/shared/config';
import { Button } from '@/shared/ui';

export function LanguageSwitcher() {
    const { t, i18n } = useTranslation();

    return (
        <section className="flex w-full flex-col gap-2.5">
            <p className="text-sm font-medium text-muted-foreground">{t('Language')}</p>
            <div className="flex gap-1 rounded-lg border bg-secondary p-1 shadow-subtle">
                {(Object.keys(lngs) as Lng[]).map((lng) => {
                    const active = i18n.resolvedLanguage === lng;
                    return (
                        <Button
                            key={lng}
                            size="lg"
                            variant={active ? 'default' : 'ghost'}
                            aria-pressed={active}
                            className="flex-1"
                            onClick={() => !active && i18n.changeLanguage(lng)}
                        >
                            {lngs[lng]}
                        </Button>
                    );
                })}
            </div>
        </section>
    );
}
