import type { IGraphPoint, IWeekTime } from '@/shared/api';

const WEEK_DAYS: { key: keyof IWeekTime, label: string }[] = [
    { key: 'monday', label: 'Пн' },
    { key: 'tuesday', label: 'Вт' },
    { key: 'wednesday', label: 'Ср' },
    { key: 'thursday', label: 'Чт' },
    { key: 'friday', label: 'Пт' },
    { key: 'saturday', label: 'Сб' },
    { key: 'sunday', label: 'Вс' },
];

export function pointNameList(point: IGraphPoint): string[] {
    const names = point.names?.map((item) => item.name).filter((name) => name.length > 0) ?? [];
    if (names.length > 0) {
        return names;
    }
    return point.displayableName ? [point.displayableName] : [];
}

export function pointTitle(point: IGraphPoint): string {
    return pointNameList(point)[0] ?? '';
}

function formatClock(value: number, unit: 'hours' | 'minutes' | 'seconds' | 'raw'): string {
    if (unit === 'hours') {
        return `${String(value).padStart(2, '0')}:00`;
    }
    if (unit === 'raw') {
        return String(value);
    }
    const totalMinutes = unit === 'seconds' ? Math.floor(value / 60) : Math.trunc(value);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function clockUnit(start: number, end: number): 'hours' | 'minutes' | 'seconds' | 'raw' {
    const max = Math.max(start, end);
    if (max <= 24) {
        return 'hours';
    }
    if (max <= 24 * 60) {
        return 'minutes';
    }
    if (max <= 24 * 60 * 60) {
        return 'seconds';
    }
    return 'raw';
}

export function weekRows(time: IWeekTime | undefined): { label: string, text: string }[] {
    if (!time) {
        return [];
    }
    return WEEK_DAYS.flatMap(({ key, label }) => {
        const day = time[key];
        if (!day) {
            return [];
        }
        if (day.isDayOff) {
            return [{ label, text: 'Выходной' }];
        }
        const unit = clockUnit(day.start, day.end);
        return [{
            label,
            text: `${formatClock(day.start, unit)} – ${formatClock(day.end, unit)}`
        }];
    });
}
