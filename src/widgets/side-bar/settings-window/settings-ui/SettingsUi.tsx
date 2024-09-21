import AgreementBtn from '../agreement';
import Contacts from '../contacts/Contacts';

import СhangeLanguage from '../change-language/СhangeLanguage';
import FeedbackForm from '../feedback-form/FeedbackForm';

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