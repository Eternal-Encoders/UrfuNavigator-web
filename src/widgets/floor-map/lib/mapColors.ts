import { Theme } from '@/entities/viewer';
import type { IColorSchema, IColorTheme, IRoom, IService } from '@/shared/api';

export interface MapPaint {
    fill?: string,
    stroke?: string,
    text?: string
}

function palette(schema: IColorSchema | undefined, theme: Theme): IColorTheme {
    if (!schema) {
        return {};
    }
    return (theme === Theme.Dark ? schema.darkColorTheme : schema.whiteColorTheme) ?? {};
}

function findSchema(schemes: IColorSchema[], id?: string | null): IColorSchema | undefined {
    if (id) {
        const match = schemes.find((schema) => schema.id === id);
        if (match) {
            return match;
        }
    }
    return schemes[0];
}

function paintFrom(
    schemes: IColorSchema[],
    theme: Theme,
    colorSchema: string | null | undefined,
    roomType: string | null | undefined,
    isBorder: boolean | undefined,
    isFill: boolean | undefined
): MapPaint {
    const colors = palette(findSchema(schemes, colorSchema), theme);
    const typeKey = roomType || undefined;

    const fill = isFill === false
        ? undefined
        : (typeKey && colors.roomTypeFill?.[typeKey]) || colors.roomFill || colors.buildingFill;
    const stroke = isBorder === false
        ? '#7f7f7f'
        : (typeKey && colors.roomTypeBorder?.[typeKey]) || colors.roomBorder || colors.buildingBorder;
    const text = (typeKey && colors.roomTypeText?.[typeKey]) || colors.roomText;
    return { fill, stroke, text };
}

export function paintForRoom(room: IRoom, schemes: IColorSchema[], theme: Theme): MapPaint {
    return paintFrom(schemes, theme, room.colorSchema, room.type, room.isBorder, room.isFill);
}

export function paintForService(service: IService, schemes: IColorSchema[], theme: Theme): MapPaint {
    return paintFrom(schemes, theme, service.colorSchema, undefined, service.isBorder, service.isFill);
}

export function buildingBackground(schemes: IColorSchema[], theme: Theme): string | undefined {
    return palette(schemes[0], theme).buildingBackground;
}
