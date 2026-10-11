import { useTranslation } from 'react-i18next';
import { selectTheme, setTheme, Theme } from '@/entities/viewer';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { Switch } from '@/shared/ui';

export function ThemeSwitch() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isDark = useAppSelector(selectTheme) === Theme.Dark;

    return (
        <section className="flex w-full flex-col gap-2.5">
            <p className="text-sm font-medium text-muted-foreground">{t('Theme')}</p>
            <label
                htmlFor="theme-switch"
                className="flex w-full items-center justify-between rounded-lg border bg-secondary px-3 py-2.5 shadow-subtle"
            >
                <span className="text-sm font-medium">
                    {isDark ? t('DarkTheme') : t('LightTheme')}
                </span>
                <Switch
                    id="theme-switch"
                    checked={isDark}
                    onCheckedChange={(checked) => dispatch(setTheme(checked ? Theme.Dark : Theme.Light))}
                    aria-label={t('Theme')}
                />
            </label>
        </section>
    );
}
