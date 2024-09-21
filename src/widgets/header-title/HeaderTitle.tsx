import styles from './HeaderTitle.module.scss';

function HeaderTitle({text}: {text: string}) {
    return (
        <>
            <div className={styles['Title']}>
                <p className={styles['title-text']}>{ text }</p>
            </div>
        </>
    );
}

export default HeaderTitle;