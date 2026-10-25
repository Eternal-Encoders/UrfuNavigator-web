import { useTranslation } from 'react-i18next';
import { lngs, type Lng } from '@/shared/config';

const flags: Record<Lng, string> = { ru: '🇷🇺', en: '🇬🇧', zh: '🇨🇳', ar: 'ع' };
const languageNames: Record<Lng, string> = { ru: 'Русский', en: 'Английский', zh: 'Китайский', ar: 'Арабский' };
export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    return <section className="settings-section">
        <h2 className="settings-section-title">Язык / Language</h2>
        <div className="language-card">
            {(['ru', 'en', 'zh', 'ar'] as Lng[]).map(lng => <button key={lng} type="button"
                aria-pressed={i18n.resolvedLanguage === lng} onClick={() => {
                    localStorage.setItem('urfuNavigator.language', lng);
                    void i18n.changeLanguage(lng);
                }}>
                <span className="language-flag">{flags[lng]}</span><span className="language-name">{languageNames[lng]}</span>
                <span>{lng === 'ru' ? 'Russian' : lngs[lng]}</span>
            </button>)}
        </div>
    </section>;
}
