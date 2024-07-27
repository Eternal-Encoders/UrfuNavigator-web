import style from "./quick-tip-button-style.module.css";

interface QuickTipButtonProps {
    tipName: string,
    tipIcon: string
}

function QuickTipButton({ tipIcon, tipName }: QuickTipButtonProps) {
    return (
        <button className={style['tip-btn-btn-reset']}>
            <img className={style['tip-icon']} src={ tipIcon }  alt={ tipName }/>
            <p className={style['tip-name']}>{ tipName }</p>
        </button>
    );
}

export default QuickTipButton;
