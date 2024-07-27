import { Link } from "react-router-dom";

import telegramLogo from "./img/telegramLogo.png"
import vkLogo from "./img/vkLogo.png"
import { useAppSelector } from "../../../../store/hook";
import { selectLang } from "../../../../features/lang/langSlice";

import style from "./contacts-style.module.css";
import { Languages } from "../../../../utils/interfaces";

function Contacts() {
    const currentLanguage = useAppSelector(selectLang)

    return (
        <div className={style['contacts-container']}>
            <p className={style['contacts-title']}>{ currentLanguage === Languages.English ? "Contacts" : "Контакты" }</p>
            <div className={style['contacts-list-container']}>
                <Link className={style['contacts-link']} to="https://t.me/navigator_urfu" target="_blank">
                    <img className={style['contacts-img']} src={ telegramLogo } alt="" />
                    <p className={style['contacts-text']}>TG</p>
                </Link>
                <Link className={style['contacts-link']} to="https://vk.com/urfu_navigator" target="_blank">
                    <img className={style['contacts-img']} src={ vkLogo } alt="" />
                    <p className={style['contacts-text']}>VK</p>
                </Link>
            </div>
        </div>
    )
}

export default Contacts;