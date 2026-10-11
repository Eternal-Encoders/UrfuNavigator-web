import { SideBarContent } from '@/entities/sidebar';
import { QuickTypes, SearchResults } from '@/features/point-search';
import { InstitutesList } from './InstitutesList';
import { SettingsPanel } from './SettingsPanel';

export function SideMenuBody({ content }: { content: SideBarContent }) {
    switch (content) {
    case SideBarContent.Institutes:
        return <InstitutesList />;
    case SideBarContent.PointsList:
        return <SearchResults />;
    case SideBarContent.Settings:
        return <SettingsPanel />;
    case SideBarContent.TypeList:
        return <QuickTypes />;
    case SideBarContent.Empty:
        return null;
    }
}
