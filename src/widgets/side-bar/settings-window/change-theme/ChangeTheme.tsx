import { useTranslation } from 'react-i18next';
import { selectTheme, setTheme } from '../../../../features/rootData/rootDataSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/hook';
import { Themes } from '../../../../utils/interfaces';
import style from './ChangeTheme.module.scss';

function ChangeTheme() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const currentTheme = useAppSelector(selectTheme);
    const isDark = currentTheme === Themes.dark;

    function onThemeToggle() {
        dispatch(setTheme(isDark ? Themes.light : Themes.dark));
    }

    return (
        <div className={style['change-theme-container']}>
            <p className={style['change-theme-title']}>{t('Theme')}</p>
            <button
                className={style['theme-toggle']}
                onClick={onThemeToggle}
                type="button"
                aria-label={t('Theme')}
            >
                <span className={style['theme-toggle-label']}>
                    {isDark ? t('DarkTheme') : t('LightTheme')}
                </span>
                <span className={style['theme-toggle-track']}>
                    <span className={isDark ? `${style['theme-toggle-thumb']} ${style['dark']}` : style['theme-toggle-thumb']} />
                </span>
            </button>
        </div>
    );
}

export default ChangeTheme;
