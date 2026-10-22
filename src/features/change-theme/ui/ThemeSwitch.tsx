import { useTranslation } from 'react-i18next';
import { Theme } from '@/entities/viewer';
import { Button } from '@/shared/ui';
import { useThemeTransition } from '../model/useThemeTransition';

export function ThemeSwitch() {
    const { t } = useTranslation();
    const { theme, changeTheme } = useThemeTransition();
    return <section className="settings-section">
        <h2 className="settings-section-title">{t('Theme')}</h2>
        <div className="theme-options" role="group" aria-label={t('Theme')}>
            {[Theme.Light, Theme.Dark].map(value => <Button key={value} variant="ghost"
                aria-pressed={theme === value} onClick={event => { void changeTheme(value, event.currentTarget); }}>
                {t(value === Theme.Light ? 'LightTheme' : 'DarkTheme')}
            </Button>)}
        </div>
    </section>;
}
