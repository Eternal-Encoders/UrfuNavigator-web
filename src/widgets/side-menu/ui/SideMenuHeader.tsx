import { Settings, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { clearRoute, selectRoutePoints } from '@/entities/route';
import { SideBarContent, selectPrevContent, setContent } from '@/entities/sidebar';
import { SearchBar, SearchTrigger } from '@/features/point-search';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { Button } from '@/shared/ui';

function SettingsButton() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    return (
        <Button
            variant="outline"
            size="icon-lg"
            aria-label={t('Settings')}
            className="text-muted-foreground"
            onClick={() => dispatch(setContent(SideBarContent.Settings))}
        >
            <Settings className="size-5" />
        </Button>
    );
}

function CloseButton() {
    const dispatch = useAppDispatch();
    const prevContent = useAppSelector(selectPrevContent);

    return (
        <Button variant="outline" size="icon-lg" aria-label="Close" onClick={() => dispatch(setContent(prevContent))}>
            <X className="size-5" />
        </Button>
    );
}

function BackButton() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const points = useAppSelector(selectRoutePoints);

    function onClickHandler() {
        if (points.from || points.to) {
            dispatch(clearRoute());
        } else {
            navigate('/');
        }
    }

    return (
        <Button variant="outline" size="icon-lg" aria-label="Back" onClick={onClickHandler}>
            <X className="size-5" />
        </Button>
    );
}

function HeaderTitle({ text }: { text: string }) {
    return (
        <div className="flex h-10 w-full items-center justify-center rounded-md border bg-secondary text-sm font-medium text-muted-foreground">
            {text}
        </div>
    );
}

export function SideMenuHeader({ content }: { content: SideBarContent }) {
    const { t } = useTranslation();

    switch (content) {
    case SideBarContent.Institutes:
        return (
            <>
                <SettingsButton />
                <SearchTrigger direction="to" isHomePage />
            </>
        );
    case SideBarContent.TypeList:
    case SideBarContent.PointsList:
        return <SearchBar />;
    case SideBarContent.Settings:
        return (
            <>
                <HeaderTitle text={t('Settings')} />
                <CloseButton />
            </>
        );
    case SideBarContent.Empty:
        return (
            <>
                <SearchTrigger direction="from" />
                <SearchTrigger direction="to" />
                <BackButton />
            </>
        );
    }
}
