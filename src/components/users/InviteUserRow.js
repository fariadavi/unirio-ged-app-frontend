import React, { useContext, useEffect, useState } from 'react'
import { UserManagementContext } from '../../contexts/UserManagementContext'
import { Form } from 'react-bootstrap'
import ReactTooltip from 'react-tooltip';
import { useTranslation } from 'react-i18next'
import { validateField } from '../utils/Validation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

const InviteUserRow = ({ disabled, hideRow }) => {
    const { t } = useTranslation();
    const { addNewUser } = useContext(UserManagementContext);
    const [email, setEmail] = useState('');
    const [emailValidation, setEmailValidation] = useState();

    useEffect(() => setEmailValidation(validateField('email', email.trim().toLowerCase())), [email]);

    const submitInvite = email => !emailValidation && addNewUser(email.trim().toLowerCase()) && setEmail('');

    return (
        <tr key="0" className="invite-user-row">
            <td></td>
            <td colSpan={8}>
                <Form.Group className="email-textbox">
                    <Form.Control
                        disabled={disabled}
                        placeholder={t('user.management.invite.placeholder')}
                        onChange={e => setEmail(e.target.value.replace(/\s+/g, ''))}
                        onKeyPress={e => e.code === 'Enter' ? submitInvite(email) : null}
                        isValid={email.length > 0 && !emailValidation}
                        isInvalid={email.length > 0 && emailValidation}
                        value={email}
                        type="email"
                        size="sm"
                    />

                    <Form.Control.Feedback type="valid" />

                    <Form.Control.Feedback type="invalid">
                        {t(`user.management.invite.validation.${emailValidation}`)}
                    </Form.Control.Feedback>
                </Form.Group>
            </td>
            <td>
                {disabled
                    ? <></>
                    :
                    <div className="actions center">
                        <span 
                            data-for="sendUserInviteButtonTooltip"
                            data-tip={t('user.management.invite.button')}
                            onClick={() => submitInvite(email) }
                        >
                            <FontAwesomeIcon className="icon" icon={faPaperPlane} />
                            <ReactTooltip id="sendUserInviteButtonTooltip" />
                        </span>
                    </div>
                }
            </td>
        </tr>
    )
}

export default InviteUserRow;