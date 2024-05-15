import { useContext } from "react";
import { GlobalContext } from "../../../../../contextes/GlobalContext";
import QuickTipButton from "../quick-tip-button/QuickTipButton";
import { PointTypes } from "../../../../../utils/interfaces";

import "./quick-tips-list.css"

import cashMachine from './img/cashMachine.svg';
import vending from './img/vending.svg';
import wardrobe from './img/wardrobe.svg';
import deanOffice from './img/deanOffice.svg';
import cafe from './img/cafe.svg';
import coworking from './img/coworking.svg'
import print from './img/print.svg'
import womenBathroom from './img/womenBathroom.svg'
import menBathroom from './img/menBathroom.svg'
import studentsUnion from './img/studentsUnion.svg'
import canteen from './img/canteen.svg'

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

interface QuickTipsListProps {
    onClick: (name: string, type: PointTypes) => void
}

function QuickTipsList({ onClick }: QuickTipsListProps) {
    const { currentLanguage } = useContext(GlobalContext);

    return (
        <>
            <p className="quick-tips-text">Быстрый поиск</p>
            <ul className="quick-tips-list list-reset flex">
                {
                    QIUCK_TIPS_LIST.map(e => (
                        <li key={ e.tipName } className="quick-tips-list-item" onClick={ () => onClick(e.tipName, e.tipType) }>
                            <QuickTipButton tipIcon={ e.tipIcon } tipName={ currentLanguage === "english" ? e.tipNameEng : e.tipName }/>
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default QuickTipsList;