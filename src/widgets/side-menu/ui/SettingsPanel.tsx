import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/features/change-language';
import { ThemeSwitch } from '@/features/change-theme';
import legal from '@/shared/assets/legal.pdf';
import { Button } from '@/shared/ui';

const FEEDBACK_FORMS = {
    ru: '64d37a5b73cee73605116cb0',
    en: '6510362502848ffde0b25c51'
};

export function SettingsPanel() {
    const { t, i18n } = useTranslation();
    const formId = i18n.resolvedLanguage === 'ru' ? FEEDBACK_FORMS.ru : FEEDBACK_FORMS.en;
    const groups = [
        { title: t('SocialNetworks'), links: [
            { href: 'https://vk.com/urfu_navigator', label: t('VKontakte') },
            { href: 'https://t.me/navigator_urfu', label: 'Telegram' }
        ] },
        { title: t('OtherSettings'), links: [
            { href: `https://forms.yandex.ru/u/${formId}/`, label: t('FillFeedbackForm') },
            { href: legal, label: t('PrivacyPolicy') }
        ] }
    ];
    return <div className="settings-panel">
        <div className="settings-sections">
            <LanguageSwitcher />
            <ThemeSwitch />
            {groups.map(group => <section className="settings-section" key={group.title}>
                <h2 className="settings-section-title">{group.title}</h2>
                <div className="settings-links">
                    {group.links.map(link => <Button asChild variant="outline" className="settings-link" key={link.href}>
                        <a href={link.href} target="_blank" rel="noreferrer">
                            {link.label}<img src="/remake/5c1d5.svg" width="12" height="12" alt="" />
                        </a>
                    </Button>)}
                </div>
            </section>)}
        </div>
        <footer className="navigator-footer">
            <p>from Eternal Encoders with love 💖</p>
            <p>© Яндекс — <a href="https://yandex.ru/legal/maps_termsofuse/" target="_blank" rel="noreferrer">{t('TermsOfUse')}</a></p>
        </footer>
    </div>;
}
