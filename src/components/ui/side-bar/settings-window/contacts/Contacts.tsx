import { Link } from "react-router-dom";

import telegramLogo from "./img/telegramLogo.png";
import vkLogo from "./img/vkLogo.png";

import { useTranslation } from "react-i18next";
import style from "./contacts-style.module.css";

function Contacts() {
    const {t} = useTranslation();

    return (
        <div className={style['contacts-container']}>
            <p className={style['contacts-title']}>{ t('Contacts') }</p>
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