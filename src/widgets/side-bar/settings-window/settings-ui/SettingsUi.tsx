import AgreementBtn from '../agreement';
import Contacts from '../contacts/Contacts';
import ChangeTheme from '../change-theme/ChangeTheme';

import ChangeLanguage from '../change-language/ChangeLanguage';
import FeedbackForm from '../feedback-form/FeedbackForm';

function SettingsUI() {
    return (
        <>
            <ChangeLanguage/>
            <ChangeTheme />
            <FeedbackForm />
            <AgreementBtn />
            <Contacts />
        </>
    )
}

export default SettingsUI;