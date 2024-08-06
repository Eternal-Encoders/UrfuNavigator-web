import { selectLang } from '../../../features/lang/langSlice';
import { useAppSelector } from '../../../store/hook';
import { Languages } from '../../../utils/interfaces';
import styles from './header-title.module.css'

interface HeaderTitleProps {
    text: {
        [lang in Languages]: string
    },
}

function HeaderTitle({text}: HeaderTitleProps) {
    const currentLanguage = useAppSelector(selectLang);

    return (
        <>
            <div className={styles['title']}>
                <p className={styles['title-text']}>{ text[currentLanguage] }</p>
            </div>
        </>
    );
}

export default HeaderTitle;