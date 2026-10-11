import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SideBarContent, selectPrevContent, setContent, setContentNoHistory } from '@/entities/sidebar';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { Button, Input } from '@/shared/ui';
import { resetSearchQuery, selectActiveSearchQuery, setSearchName } from '../model/pointSearchSlice';

export function SearchBar() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { name } = useAppSelector(selectActiveSearchQuery);
    const prevContent = useAppSelector(selectPrevContent);

    function nameChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        dispatch(setSearchName(value));
        dispatch(setContentNoHistory(value === '' ? SideBarContent.TypeList : SideBarContent.PointsList));
    }

    function cancelHandler() {
        if (name) {
            dispatch(resetSearchQuery());
        } else {
            dispatch(setContent(prevContent));
        }
    }

    return (
        <>
            <Search className="mx-2.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
            <Input
                type="text"
                className="h-10 bg-secondary font-semibold placeholder:text-subtle-foreground"
                value={name}
                placeholder={t('SearchForAudiencesAndPlaces')}
                aria-label={t('SearchForAudiencesAndPlaces')}
                onChange={nameChangeHandler}
                autoFocus
            />
            <Button variant="ghost" size="icon-lg" aria-label="Search Cancel" onClick={cancelHandler}>
                <X className="size-5" />
            </Button>
        </>
    );
}
