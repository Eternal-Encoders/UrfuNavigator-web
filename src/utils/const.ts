import { PointTypes } from './interfaces';

import cafe from './icons/cafe.svg';
import canteen from './icons/canteen.svg';
import cashMachine from './icons/cashMachine.svg';
import coworking from './icons/coworking.svg';
import deanOffice from './icons/deanOffice.svg';
import menBathroom from './icons/menBathroom.svg';
import print from './icons/print.svg';
import studentsUnion from './icons/studentsUnion.svg';
import vending from './icons/vending.svg';
import wardrobe from './icons/wardrobe.svg';
import womenBathroom from './icons/womenBathroom.svg';

const InstColors = new Map<string, string>();
InstColors.set('ИРИТ-РТФ', '#265D93');
InstColors.set('ГУК', '#E77011');
InstColors.set('УРАЛЭНИН', '#46296A');
InstColors.set('ИНМИТ-ХТИ', '#68A357');
InstColors.set('ИСА', '#A02B09');
InstColors.set('УГИ', '#662B73');

const InstLinks = new Map<string, string>();
InstLinks.set('ИРИТ-РТФ', '/irit');
InstLinks.set('ИСА', '/isa');
InstLinks.set('ГУК', '/guk');
InstLinks.set('УРАЛЭНИН', '/uralenin');
InstLinks.set('ИНМИТ-ХТИ', '/inmit-hti');
InstLinks.set('УГИ', '/ugi');

const QIUCK_TIPS_LIST = [
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

const PHONE_BREAKPOINT = 1200;

export {
    InstColors,
    InstLinks, PHONE_BREAKPOINT, QIUCK_TIPS_LIST
};

