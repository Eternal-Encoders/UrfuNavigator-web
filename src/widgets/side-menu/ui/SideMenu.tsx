import { cn } from '@/shared/lib';
import { DragHandle, Panel } from '@/shared/ui';
import { useSideMenu } from '../model/useSideMenu';
import { SideMenuBody } from './SideMenuBody';
import { SideMenuHeader } from './SideMenuHeader';

const headerClass = 'flex items-center justify-start gap-1 p-1';
const bodyClass = 'flex w-full flex-col items-center justify-start overflow-y-auto bg-card';

export function SideMenu() {
    const {
        content,
        isPhone,
        isEmpty,
        isHeadInDrawer,
        position,
        touchStartHandle,
        touchMoveHandle,
        touchEndHandle
    } = useSideMenu();

    const header = <SideMenuHeader content={content} />;
    const body = <SideMenuBody content={content} />;

    if (isPhone) {
        return (
            <>
                {!isHeadInDrawer &&
                    <Panel elevated className={cn(headerClass, 'absolute top-0 z-20 mx-2 mt-3 w-[calc(100%-24px)]')}>
                        {header}
                    </Panel>
                }
                {!isEmpty &&
                    <div
                        className={cn(
                            bodyClass,
                            'absolute bottom-(--keyboard-offset) left-0 z-20 rounded-t-xl px-3 py-2 shadow-elevated'
                        )}
                        onTouchStart={touchStartHandle}
                        onTouchMove={touchMoveHandle}
                        onTouchEnd={touchEndHandle}
                        role="dialog"
                        aria-modal="false"
                        style={{ height: position }}
                    >
                        <DragHandle />
                        {isHeadInDrawer &&
                            <Panel elevated className={cn(headerClass, 'relative mx-auto mb-6 w-full')}>
                                {header}
                            </Panel>
                        }
                        {body}
                    </div>
                }
            </>
        );
    }

    return (
        <aside
            className={cn(
                'absolute top-0 left-0 z-10 h-full w-(--panel-width) min-w-85 border-r bg-card px-3 py-4',
                'shadow-soft backdrop-blur-sm animate-in fade-in slide-in-from-left duration-500'
            )}
        >
            <Panel elevated className={cn(headerClass, 'mb-3')}>
                {header}
            </Panel>
            <div className={cn(bodyClass, 'h-full px-3 py-4')}>
                {body}
            </div>
        </aside>
    );
}
