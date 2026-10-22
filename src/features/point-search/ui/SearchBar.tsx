import { useTranslation } from 'react-i18next';
import { SideBarContent, setContent, setContentNoHistory } from '@/entities/sidebar';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { Button, Input } from '@/shared/ui';
import { resetSearchQuery, selectActiveSearchQuery, setSearchName } from '../model/pointSearchSlice';

export function SearchBar() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { name } = useAppSelector(selectActiveSearchQuery);
    function close() {
        dispatch(resetSearchQuery());
        dispatch(setContent(window.location.pathname === '/' ? SideBarContent.Institutes : SideBarContent.Empty));
    }
    return <>
        <div className="navigator-input">
            <img src="/remake/7b59f.svg" alt="" width="24" height="24" />
            <span className="small-input-frame">
                <Input className="small-input [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none" type="search" value={name} placeholder={t('SearchForAudiencesAndPlaces')}
                    aria-label={t('SearchForAudiencesAndPlaces')} autoFocus onKeyDown={e => { if (e.key === 'Escape') close(); }}
                    onChange={e => {
                        dispatch(setSearchName(e.currentTarget.value));
                        const next = e.currentTarget.value ? SideBarContent.PointsList : SideBarContent.TypeList;
                        dispatch(setContentNoHistory(next));
                    }} />
            </span>
        </div>
        <Button variant="secondary" size="icon-lg" aria-label={t('Close')} onClick={close}>
            <img src="/remake/f17f3.svg" alt="" width="20" height="20" />
        </Button>
    </>;
}
