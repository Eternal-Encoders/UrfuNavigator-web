import styles from './header-title.module.css';

function HeaderTitle({text}: {text: string}) {
    return (
        <>
            <div className={styles['title']}>
                <p className={styles['title-text']}>{ text }</p>
            </div>
        </>
    );
}

export default HeaderTitle;