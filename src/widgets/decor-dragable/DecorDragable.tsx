
import styles from './DecorDragable.module.scss';

// interface DecorDragableProps {

// }

function DecorDragable() {
    return (
        <div className={styles['DragableContainer']}>
            <div className={styles['dragable-block']}></div>
        </div>
    );
}

export default DecorDragable;