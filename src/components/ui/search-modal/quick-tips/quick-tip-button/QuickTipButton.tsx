import style from "./quick-tip-button-style.module.css";

interface QuickTipButtonProps {
    tipName: string,
    tipIcon: string
}

function QuickTipButton({ tipIcon, tipName }: QuickTipButtonProps) {
    return (
        <button className={style.tipBtnBtnReset}>
            <img className={style.tipIcon} src={ tipIcon }  alt={ tipName }/>
            <p className={style.tipName}>{ tipName }</p>
        </button>
    );
}

export default QuickTipButton;
