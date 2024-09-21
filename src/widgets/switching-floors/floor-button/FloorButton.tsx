import { floorSet, selectFloor } from '../../../features/floor/floorSlice';
import { selectSearchPoints } from '../../../features/pointsSearch/pointsSearchSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import styles from './FloorButton.module.scss';

interface FloorButtonProps {
    currentInst: string,
    floorNumber: number
}

function FloorButton({ currentInst, floorNumber }: FloorButtonProps) {
    const dispatch = useAppDispatch()
    const floor = useAppSelector(selectFloor)
    const points = useAppSelector(selectSearchPoints)
    
    const className = [
        styles['floor-button'], 
        floor === floorNumber ? styles['active']: '',
        (points.from && points.from.floor === floorNumber) 
        && 
        points.from.institute === currentInst 
        || 
            (points.to && points.to.floor === floorNumber) && points.to.institute === currentInst ? 
            styles['on-the-way']: 
            ''
    ];

    return (
        <li className={styles['floor-element']}>
            <button 
                className={ className.join(' ') }
                value={ floorNumber } 
                onClick={ (e) => dispatch(floorSet(Number(e.currentTarget.value))) }
            >
                { floorNumber }
            </button>
        </li>
    )
}

export default FloorButton;