import { PointTypes } from '@/shared/api';

import cafe from '@/shared/assets/icons/point-types/cafe.svg';
import canteen from '@/shared/assets/icons/point-types/canteen.svg';
import cashMachine from '@/shared/assets/icons/point-types/cashMachine.svg';
import coworking from '@/shared/assets/icons/point-types/coworking.svg';
import deanOffice from '@/shared/assets/icons/point-types/deanOffice.svg';
import menBathroom from '@/shared/assets/icons/point-types/menBathroom.svg';
import print from '@/shared/assets/icons/point-types/print.svg';
import studentsUnion from '@/shared/assets/icons/point-types/studentsUnion.svg';
import vending from '@/shared/assets/icons/point-types/vending.svg';
import wardrobe from '@/shared/assets/icons/point-types/wardrobe.svg';
import womenBathroom from '@/shared/assets/icons/point-types/womenBathroom.svg';

export const PointTranslation: Record<PointTypes, string> = {
    [PointTypes.Corridor]: 'Коридор',
    [PointTypes.Auditorium]: 'Аудитория',
    [PointTypes.Dinning]: 'Столовая',
    [PointTypes.Exit]: 'Вход/Выход',
    [PointTypes.Stair]: 'Лестница',
    [PointTypes.ToiletM]: 'Туалет (М)',
    [PointTypes.ToiletW]: 'Туалет (Ж)',
    [PointTypes.Cafe]: 'Кафе',
    [PointTypes.Vending]: 'Вендинг',
    [PointTypes.Coworking]: 'Коворкинг',
    [PointTypes.Atm]: 'Банкомат',
    [PointTypes.Wardrobe]: 'Гардероб',
    [PointTypes.Print]: 'Печать',
    [PointTypes.Deanery]: 'Деканат',
    [PointTypes.Students]: 'Союз Студентов',
    [PointTypes.Other]: 'Другое...'
};

export interface QuickPointType {
    tipType: PointTypes,
    title: string,
    tipIcon: string
}

export const QUICK_POINT_TYPES: QuickPointType[] = [
    { tipType: PointTypes.ToiletW, title: 'WC (W)', tipIcon: womenBathroom },
    { tipType: PointTypes.ToiletM, title: 'WC (M)', tipIcon: menBathroom },
    { tipType: PointTypes.Cafe, title: 'Cafe', tipIcon: cafe },
    { tipType: PointTypes.Vending, title: 'Vending Machine',  tipIcon: vending },
    { tipType: PointTypes.Coworking, title: 'Coworking', tipIcon: coworking },
    { tipType: PointTypes.Atm, title: 'ATM', tipIcon: cashMachine },
    { tipType: PointTypes.Wardrobe, title: 'Cloakroom', tipIcon: wardrobe },
    { tipType: PointTypes.Print, title: 'Public Printer', tipIcon: print },
    { tipType: PointTypes.Deanery, title: 'Head Office', tipIcon: deanOffice },
    { tipType: PointTypes.Students, title: 'Student Union', tipIcon: studentsUnion },
    { tipType: PointTypes.Dinning, title: 'Canteen', tipIcon: canteen },
];
