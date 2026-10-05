import { useTranslation } from 'react-i18next';
import { QUICK_POINT_TYPES } from '@/entities/point';
import { SideBarContent, setContentNoHistory } from '@/entities/sidebar';
import { useAppDispatch } from '@/shared/lib';
import { setSearchType } from '../model/pointSearchSlice';

export function QuickTypes() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    return (
        <>
            <p className="mb-5 self-start text-sm font-medium text-muted-foreground">
                {t('QuickSearch')}
            </p>
            <ul className="grid w-full grid-cols-4 min-[461px]:grid-cols-5 desktop:grid-cols-4">
                {QUICK_POINT_TYPES.map(({ title, tipType, tipIcon }) => {
                    const label = t(title);
                    return (
                        <li key={tipType} className="mb-2.5 flex justify-center">
                            <button
                                type="button"
                                className="flex w-20 flex-col items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                                onClick={() => {
                                    dispatch(setSearchType({ name: label, type: tipType }));
                                    dispatch(setContentNoHistory(SideBarContent.PointsList));
                                }}
                            >
                                <img className="rounded-md shadow-subtle" src={tipIcon} alt={label} />
                                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
