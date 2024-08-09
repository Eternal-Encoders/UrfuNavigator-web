import СhangeLanguage from "../change-language/СhangeLanguage"
import Contacts from "../contacts/Contacts";
import AgreementBtn from "../agreement";

import FeedbackForm from "../feedback-form/FeedbackForm";

function SettingsUI() {
    return (
        <>
            <СhangeLanguage/>
            <FeedbackForm />
            <AgreementBtn />
            <Contacts />
        </>
    )
}

export default SettingsUI;