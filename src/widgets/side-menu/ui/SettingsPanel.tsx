import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/features/change-language';
import { ThemeSwitch } from '@/features/change-theme';
import legal from '@/shared/assets/legal.pdf';
import tgLogo from '@/shared/assets/icons/tgLogo.svg';
import vkLogo from '@/shared/assets/icons/vkLogo.svg';
import { Button } from '@/shared/ui';

const FEEDBACK_FORMS = {
    ru: '64d37a5b73cee73605116cb0',
    en: '6510362502848ffde0b25c51'
};

const CONTACTS = [
    { href: 'https://t.me/navigator_urfu', icon: tgLogo, alt: 'Телеграмм', label: 'TG' },
    { href: 'https://vk.com/urfu_navigator', icon: vkLogo, alt: 'Вконтакте', label: 'VK' }
];

const sectionTitle = 'text-sm font-medium text-muted-foreground';
const linkButton = 'h-11 w-full bg-secondary text-muted-foreground shadow-subtle hover:text-foreground';

export function SettingsPanel() {
    const { t, i18n } = useTranslation();
    const formId = i18n.resolvedLanguage === 'ru' ? FEEDBACK_FORMS.ru : FEEDBACK_FORMS.en;

    return (
        <div className="flex w-full flex-col gap-3">
            <LanguageSwitcher />
            <ThemeSwitch />
            <section className="flex w-full flex-col gap-2.5">
                <p className={sectionTitle}>{t('AreYouHavingAnyProblemsWithOurSite')}</p>
                <Button asChild variant="outline" className={linkButton}>
                    <a href={`https://forms.yandex.ru/u/${formId}/`} target="_blank" rel="noreferrer">
                        {t('FeedbackForm')}
                    </a>
                </Button>
            </section>
            <Button asChild variant="outline" className={`${linkButton} h-auto py-4 text-center whitespace-normal`}>
                <a href={legal} target="_blank" rel="noreferrer">
                    {t('PersonalDataProcessingPolicyAndPrivacyPolicy')}
                </a>
            </Button>
            <section className="mt-2 flex flex-col gap-2.5 self-start">
                <p className={sectionTitle}>{t('Contacts')}</p>
                <div className="flex gap-1.5">
                    {CONTACTS.map((contact) => (
                        <a
                            key={contact.label}
                            href={contact.href}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col items-center gap-2 rounded-md"
                        >
                            <img className="size-16" src={contact.icon} alt={contact.alt} />
                            <span className={sectionTitle}>{contact.label}</span>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}
