import "./quick-tip-button-style.css";

interface QuickTipButtonProps {
    tipName: string,
    tipIcon: string
}

function QuickTipButton({ tipIcon, tipName }: QuickTipButtonProps) {
    return (
        <button className="tip-btn btn-reset">
            <img className="tip-icon" src={ tipIcon }  alt={ tipName }/>
            <p className="tip-name">{ tipName }</p>
        </button>
    );
}

export default QuickTipButton;
