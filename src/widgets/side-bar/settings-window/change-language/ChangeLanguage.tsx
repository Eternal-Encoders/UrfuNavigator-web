import { useTranslation } from 'react-i18next';
import { lngs } from '../../../../shared/config/i18n/i18nLangs';
import { Button } from '../../../../shared/ui/Button/Button';
import { Ilngs } from '../../../../utils/interfaces';
import style from './ChangeLanguage.module.scss';

function ChangeLanguage() {
    const { t, i18n } = useTranslation();

    return (
        <div className={style['ChangeLanguageContainer']}>
            <p className={style['change-language-title']}>{ t('Language') }</p>
            <div className={style['change-language-div']}>
                {Object.keys(lngs).map((lng) => (
                    <Button
                        onClick={ () => i18n.changeLanguage(lng) }
                        key={lng}
                        disabled={i18n.resolvedLanguage === lng}
                        variant={i18n.resolvedLanguage === lng ? (lng === 'ru' ? 'primary' : 'danger') : 'ghost'}
                        fullWidth
                    >
                        {lngs[lng as keyof Ilngs]}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default ChangeLanguage;
