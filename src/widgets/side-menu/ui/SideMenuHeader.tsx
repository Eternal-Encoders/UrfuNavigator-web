import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SideBarContent, setContent, setContentNoHistory, setSettingsOpen } from '@/entities/sidebar';
import { SearchBar, SearchTrigger } from '@/features/point-search';
import { useAppDispatch } from '@/shared/lib';
import { Button } from '@/shared/ui';

export function SideMenuHeader({ content, campusProgress }: { content: SideBarContent, campusProgress?: number }) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    if (campusProgress !== undefined) return <>
        <SearchTrigger direction="to" isHomePage />
        <Button variant="secondary" size="icon-lg" className="relative" aria-label={t(campusProgress > 0.5 ? 'Close' : 'Settings')}
            onClick={() => dispatch(campusProgress > 0.5
                ? setContentNoHistory(SideBarContent.Institutes) : setSettingsOpen(true))}>
            <span className="absolute" style={{ opacity: 1 - campusProgress, transform: `rotate(${campusProgress * 90}deg)` }}>
                <img src="/remake/ff6fa.svg" alt="" width="20" height="20" />
            </span>
            <span className="absolute" style={{ opacity: campusProgress, transform: `rotate(${(1 - campusProgress) * -90}deg)` }}>
                <img src="/remake/f17f3.svg" alt="" width="20" height="20" />
            </span>
        </Button>
    </>;
    if (content === SideBarContent.TypeList || content === SideBarContent.PointsList) return <SearchBar />;
    if (content === SideBarContent.Route) {
        return <><span className="navigator-heading">{t('Route')}</span>
            <Button variant="secondary" size="icon-lg" aria-label={t('Close')} onClick={() => dispatch(setContent(window.location.pathname === '/' ? SideBarContent.Institutes : SideBarContent.Empty))}>
                <img src="/remake/f17f3.svg" alt="" width="20" height="20" />
            </Button></>;
    }
    return <>
        <SearchTrigger direction="to" isHomePage />
        <Button variant="secondary" size="icon-lg" aria-label={t(content === SideBarContent.Empty ? 'Campus' : 'Settings')}
            onClick={() => content === SideBarContent.Empty ? navigate('/') : dispatch(setSettingsOpen(true))}>
            <img src={content === SideBarContent.Empty ? '/remake/03b09.svg' : '/remake/ff6fa.svg'} alt="" width="20" height="20" />
        </Button>
    </>;
}
