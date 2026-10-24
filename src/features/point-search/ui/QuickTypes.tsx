import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { clearSelectedPoint, QUICK_POINT_TYPES } from '@/entities/point';
import { clearRoute } from '@/entities/route';
import { SideBarContent, selectContent, setContentNoHistory } from '@/entities/sidebar';
import { selectScreenSize } from '@/entities/viewer';
import { PointTypes } from '@/shared/api';
import { arrowRightIcon } from '@/shared/assets/icons/common';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { useAppDispatch, useAppSelector, useCarouselEndPull } from '@/shared/lib';
import { setSearchDirection, setSearchType } from '../model/pointSearchSlice';

const primaryTypes = [
    PointTypes.ToiletM, PointTypes.ToiletW, PointTypes.Dinning,
    PointTypes.Coworking, PointTypes.Cafe, PointTypes.Print
];
export function QuickTypes({ expandable = true }: { expandable?: boolean }) {
    const dispatch = useAppDispatch();
    const content = useAppSelector(selectContent);
    const { t } = useTranslation();
    const [showAll, setAll] = useState(false);
    const all = expandable && (content === SideBarContent.Categories || showAll);
    const isPhone = useAppSelector(selectScreenSize).innerWidth <= PHONE_BREAKPOINT;
    function toggleCategories() {
        if (content === SideBarContent.Categories) {
            setAll(false);
            dispatch(setContentNoHistory(SideBarContent.Empty));
        } else if (!all && isPhone && content === SideBarContent.Empty) {
            dispatch(setContentNoHistory(SideBarContent.Categories));
        } else {
            setAll(!all);
        }
    }
    const { listRef, progress } = useCarouselEndPull(expandable && isPhone && !all, toggleCategories);
    const items = all ? QUICK_POINT_TYPES
        : primaryTypes.flatMap(type => QUICK_POINT_TYPES.filter(item => item.tipType === type));
    return <ul ref={listRef} className={`category-list ${all ? 'all-categories' : ''}`}
        style={{ '--category-pull-progress': progress,
            '--category-pull-offset': `${-32 * progress / (progress + 0.5)}px` } as CSSProperties}>
        {items.map(({ title, tipType, tipIcon }) => <li key={tipType}>
            <button type="button" className="category-card" onClick={() => {
                if (content !== SideBarContent.TypeList && content !== SideBarContent.PointsList) {
                    dispatch(clearRoute());
                    dispatch(clearSelectedPoint());
                    dispatch(setSearchDirection('browse'));
                }
                dispatch(setSearchType({ name: t(title), type: tipType }));
                dispatch(setContentNoHistory(SideBarContent.PointsList));
            }}>
                <img src={tipIcon} alt="" width={primaryTypes.includes(tipType) ? 32 : 40} height={primaryTypes.includes(tipType) ? 32 : 40} />
                <span>{t(title)}</span>
            </button>
        </li>)}
        {expandable && <li><button type="button" className="all-category-button" aria-expanded={all} onClick={toggleCategories}>
            <span className="category-pull-indicator">
                <svg className="category-pull-ring" viewBox="0 0 44 44" aria-hidden="true">
                    <circle cx="22" cy="22" r="20" pathLength="1" />
                </svg>
                <img src={arrowRightIcon} alt="" width="20" height="20" />
            </span>
            {t(all ? 'FewerCategories' : 'AllCategories')}
        </button></li>}
    </ul>;
}
