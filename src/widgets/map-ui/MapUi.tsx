
import { selectFromPoint, selectToPoint } from '../../features/pointsSearch/pointsSearchSlice';
import { useAppSelector } from '../../store/hook';
import DescriptionMenu from '../description-menu/DescriptionMenu';
import SideMenu from '../side-bar/side-menu/SideMenu';
import FloorsList from '../switching-floors/floors-list/FloorsList';
import RedirectInstitute from '../switching-institutions/redirect-institute/redirect-institute';

import style from './MapUi.module.scss';

interface MapUIProps {
    instFullName: string,
    firstFloor: number,
    lastFloor: number
}

function MapUI({ instFullName, firstFloor, lastFloor }: MapUIProps) {
    const start = useAppSelector(selectFromPoint)
    const end = useAppSelector(selectToPoint)
        
    return (
        <div className={`container ${style['UIContainer']}`}>
            <SideMenu />
            <div className={style['floor-list-container']}>
                <FloorsList currentInst={instFullName} firstFloor={firstFloor} lastFloor={lastFloor}/>
            </div>
            <div className={style['institute-name-div']}>
                <RedirectInstitute 
                    instName={ start ? start.institute : (end ? end.institute : instFullName) } 
                    currentInst={instFullName}/>
                {end && start && end.institute !== start.institute ? 
                    <RedirectInstitute instName={end.institute} currentInst={instFullName}/>:
                    null
                }
            </div>
            <DescriptionMenu />
        </div>
    )
}

export default MapUI;