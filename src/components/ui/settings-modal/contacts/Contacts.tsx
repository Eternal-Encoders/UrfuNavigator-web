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
        <div className={style.contactsContainer}>
            <p className={style.contactsTitle}>{ currentLanguage === Languages.English ? "Contacts" : "Контакты" }</p>
            <div className={style.contactsListContainer}>
                <Link className={style.contactsLink} to="https://t.me/navigator_urfu" target="_blank">
                    <img className={style.contactsImg} src={ telegramLogo } alt="" />
                    <p className={style.contactsText}>TG</p>
                </Link>
                <Link className={style.contactsLink} to="https://vk.com/urfu_navigator" target="_blank">
                    <img className={style.contactsImg} src={ vkLogo } alt="" />
                    <p className={style.contactsText}>VK</p>
                </Link>
            </div>
        </div>
    )
}

export default Contacts;