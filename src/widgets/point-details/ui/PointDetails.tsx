import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useGetBuildingsQuery } from '@/entities/building';
import {
    clearSelectedPoint,
    pointNameList,
    pointTitle,
    PointTranslation,
    useGetPointByIdQuery,
    weekRows
} from '@/entities/point';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { cn, DrawerOrient, useAppDispatch, useAppSelector, useDrawer } from '@/shared/lib';
import { Button, DragHandle, Panel } from '@/shared/ui';

interface PointDetailsProps {
    pointId: string
}

function DetailsSection({ title, children }: { title: string, children: ReactNode }) {
    return (
        <section className="rounded-md bg-secondary p-3">
            <h4 className="mb-1 font-semibold">{title}</h4>
            {children}
        </section>
    );
}

function DetailsList({ items }: { items: ReactNode[] }) {
    return (
        <ul className="space-y-1 pl-4">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    );
}

export function PointDetails({ pointId }: PointDetailsProps) {
    const dispatch = useAppDispatch()
    const { data } = useGetPointByIdQuery(pointId)
    const { data: buildings } = useGetBuildingsQuery()
    const { innerWidth } = useAppSelector(selectScreenSize)
    const isPhone = innerWidth <= PHONE_BREAKPOINT

    const {
        position,
        touchStartHandle,
        touchMoveHandle,
        touchEndHandle,
        isNearMin
    } = useDrawer(
        450,
        [135, 0.46, 0.95],
        DrawerOrient.Vertical
    );

    function close() {
        dispatch(clearSelectedPoint())
    }

    if (data === undefined) {
        return null
    }

    const names = pointNameList(data)
    const otherNames = names.length <= 1 ? undefined : names.slice(1)
    const buildingName = buildings?.find((building) => building.id === data.buildingId)?.displayableName
    const schedule = weekRows(data.time)

    const content = (
        <>
            <Panel elevated className={cn('flex w-full justify-between gap-1 p-1', isPhone ? 'mx-auto mb-6' : 'mb-3')}>
                <div className="flex grow items-center rounded-md bg-secondary px-3 py-2 text-left leading-tight">
                    {pointTitle(data)}
                </div>
                <Button variant="outline" size="icon-lg" aria-label="Close description" onClick={close}>
                    <X className="size-5" />
                </Button>
            </Panel>
            <div
                className={cn(
                    'flex w-full flex-col gap-2 overflow-y-auto px-3',
                    isPhone ? 'h-[calc(100%-92px)] py-2' : 'h-[calc(100%-72px)] py-4'
                )}
            >
                {otherNames &&
                    <DetailsSection title="Другие названия">
                        <DetailsList items={otherNames} />
                    </DetailsSection>
                }
                {buildingName &&
                    <DetailsSection title="Институт">{buildingName}</DetailsSection>
                }
                {data.description &&
                    <DetailsSection title="Описание">{data.description}</DetailsSection>
                }
                {data.info &&
                    <DetailsSection title="Прочая информация">{data.info}</DetailsSection>
                }
                <DetailsSection title="Тип">
                    <DetailsList items={data.types.map((type) => PointTranslation[type])} />
                </DetailsSection>
                {schedule.length > 0 &&
                    <DetailsSection title="Время работы">
                        <DetailsList items={schedule.map((day) => `${day.label}: ${day.text}`)} />
                    </DetailsSection>
                }
            </div>
        </>
    )

    if (isPhone) {
        return (
            <div
                className="absolute bottom-(--keyboard-offset) z-20 flex w-full flex-col bg-card p-2"
                onTouchStart={touchStartHandle}
                onTouchMove={touchMoveHandle}
                onTouchEnd={() => {
                    touchEndHandle();
                    if (isNearMin(80)) {
                        close()
                    }
                }}
                style={{ height: position }}
            >
                <DragHandle />
                {content}
            </div>
        )
    }

    return (
        <aside
            className={cn(
                'absolute top-0 right-0 z-10 h-full w-(--panel-width) min-w-90 border-l bg-card py-4 pr-17 pl-3',
                'shadow-soft backdrop-blur-sm animate-in fade-in slide-in-from-right duration-500'
            )}
        >
            {content}
        </aside>
    );
}
