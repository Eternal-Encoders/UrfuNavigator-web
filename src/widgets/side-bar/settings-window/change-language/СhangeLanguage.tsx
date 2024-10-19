import { useTranslation } from 'react-i18next';
import { lngs } from '../../../../shared/config/i18n/i18nLangs';
import { classNames } from '../../../../shared/lib/classNames/classNames';
import { Button } from '../../../../shared/ui/Button/Button';
import { Ilngs } from '../../../../utils/interfaces';
import style from './СhangeLanguage.module.scss';

function СhangeLanguage() {
    const {t, i18n} = useTranslation();

    return (
        <div className={style['ChangeLanguageContainer']}>
            <p className={style['change-language-title']}>{ t('Language') }</p>
            <div className={style['change-language-div']}>
                {Object.keys(lngs).map((lng) => (                
                    <Button 
                        onClick={ () => i18n.changeLanguage(lng) } 
                        key={lng} 
                        disabled={i18n.resolvedLanguage === lng}
                        className={classNames('', 
                            {'active-russian': 'ru' === i18n.resolvedLanguage && lng === 'ru', 
                                'active-english': 'en' === i18n.resolvedLanguage && lng === 'en'}, 
                            [])
                        }
                    >
                        <p>{lngs[lng as keyof Ilngs]}</p>
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default СhangeLanguage;