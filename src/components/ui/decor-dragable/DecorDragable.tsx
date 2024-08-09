
import styles from './decor-dragable.module.css';

interface DecorDragableProps {

}

function DecorDragable({}: DecorDragableProps) {
    return (
        <div className={styles['dragable-conteiner']}>
            <div className={styles['dragable-block']}></div>
        </div>
    );
}

export default DecorDragable;