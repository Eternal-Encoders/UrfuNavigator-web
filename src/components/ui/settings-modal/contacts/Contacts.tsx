import { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../../../contextes/GlobalContext";

import "./contacts-style.css";
import telegramLogo from "./img/telegramLogo.png"
import vkLogo from "./img/vkLogo.png"

function Contacts() {
    const { currentLanguage } = useContext(GlobalContext);

    return (
        <div className="contacts-container">
            <p className="contacts-title">{ currentLanguage === "english" ? "Contacts" : "Контакты" }</p>
            <div className="contacts-list-container">
                <Link className="contacts-link" to="https://t.me/navigator_urfu" target="_blank">
                    <img className="contacts-img" src={ telegramLogo } alt="" />
                    <p className="contacts-text">TG</p>
                </Link>
                <Link className="contacts-link" to="https://vk.com/urfu_navigator" target="_blank">
                    <img className="contacts-img" src={ vkLogo } alt="" />
                    <p className="contacts-text">VK</p>
                </Link>
            </div>
        </div>
    )
}

export default Contacts;