import { Link } from 'react-router-dom';

import tgLogo from '../../../../shared/assets/icons/tgLogo.svg';
import vkLogo from '../../../../shared/assets/icons/vkLogo.svg';

import { useTranslation } from 'react-i18next';
import style from './Contacts.module.scss';

function Contacts() {
    const {t} = useTranslation();

    return (
        <div className={style['ContactsContainer']}>
            <p className={style['contacts-title']}>{ t('Contacts') }</p>
            <div className={style['contacts-list-container']}>
                <Link className={style['contacts-link']} to="https://t.me/navigator_urfu" target="_blank">
                    <img className={style['contacts-img']} src={ tgLogo } alt="Телеграмм" />
                    <p className={style['contacts-text']}>TG</p> 
                </Link>
                <Link className={style['contacts-link']} to="https://vk.com/urfu_navigator" target="_blank">
                    <img className={style['contacts-img']} src={ vkLogo } alt="Вконтакте" />
                    <p className={style['contacts-text']}>VK</p>
                </Link>
            </div>
        </div>
    )
}

export default Contacts;