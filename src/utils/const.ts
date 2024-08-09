import { PointTypes } from "./interfaces";

import cashMachine from '../shared/img/cashMachine.svg';
import vending from '../shared/img/vending.svg';
import wardrobe from '../shared/img/wardrobe.svg';
import deanOffice from '../shared/img/deanOffice.svg';
import cafe from '../shared/img/cafe.svg';
import coworking from '../shared/img/coworking.svg'
import print from '../shared/img/print.svg'
import womenBathroom from '../shared/img/womenBathroom.svg'
import menBathroom from '../shared/img/menBathroom.svg'
import studentsUnion from '../shared/img/studentsUnion.svg'
import canteen from '../shared/img/canteen.svg'

const InstColors = new Map<string, string>();
InstColors.set("ИРИТ-РТФ", "#265D93");
InstColors.set("ГУК", "#E77011");
InstColors.set("УРАЛЭНИН", "#46296A");
InstColors.set("ИНМИТ-ХТИ", "#68A357");
InstColors.set("ИСА", "#A02B09");
InstColors.set("УГИ", "#662B73");

const InstLinks = new Map<string, string>();
InstLinks.set("ИРИТ-РТФ", "/irit");
InstLinks.set("ИСА", "/isa");
InstLinks.set("ГУК", "/guk");
InstLinks.set("УРАЛЭНИН", "/uralenin");
InstLinks.set("ИНМИТ-ХТИ", "/inmit-hti");
InstLinks.set("УГИ", "/ugi");

const QIUCK_TIPS_LIST = [
    { tipType: PointTypes.ToiletW, tipName: "Санузел (Ж)", tipNameEng: "WC (W)", tipIcon: womenBathroom },
    { tipType: PointTypes.ToiletM, tipName: "Санузел (М)", tipNameEng: "WC (M)", tipIcon: menBathroom },
    { tipType: PointTypes.Cafe, tipName: "Кафе", tipNameEng: "Cafe", tipIcon: cafe },
    { tipType: PointTypes.Vending, tipName: "Вендинг", tipNameEng: "Vending Machine", tipIcon: vending },
    { tipType: PointTypes.Coworking, tipName: "Коворкинг", tipNameEng: "Coworking", tipIcon: coworking },
    { tipType: PointTypes.Atm, tipName: "Банкомат", tipNameEng: "ATM", tipIcon: cashMachine },
    { tipType: PointTypes.Wardrobe, tipName: "Гардероб", tipNameEng: "Cloakroom", tipIcon: wardrobe },
    { tipType: PointTypes.Print, tipName: "Печать", tipNameEng: "Public Printer", tipIcon: print },
    { tipType: PointTypes.Deanery, tipName: "Деканат", tipNameEng: "Head Office", tipIcon: deanOffice },
    { tipType: PointTypes.Students, tipName: "Союз студентов", tipNameEng: "Student Union", tipIcon: studentsUnion },
    { tipType: PointTypes.Dinning, tipName: "Столовая", tipNameEng: "Canteen", tipIcon: canteen },
];

const PHONE_BREAKPOINT = 1200;

export { 
    InstColors, 
    InstLinks,
    QIUCK_TIPS_LIST,
    PHONE_BREAKPOINT
}