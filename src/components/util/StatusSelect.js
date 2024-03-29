import React, { useContext, useEffect, useState } from 'react'
import { NetworkContext } from '../../contexts/NetworkContext'
import { useTranslation } from 'react-i18next'
import { Form } from 'react-bootstrap'
import Select from './Select'

const StatusSelect = ({ statuses = undefined, disabled = false, className, label, name = 'status', onChange, isValid, isInvalid, size, validationMessage, value }) => {
    const { t } = useTranslation();
    const { rq } = useContext(NetworkContext);
    const [statusList, setStatusList] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        rq('/documents/status', { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(c => { if (c) setStatusList(c); setLoading(false); });
    }, [rq]);

    return <Select
        className={className}
        disabled={disabled}
        label={label}
        name={name}
        isValid={isValid}
        isInvalid={isInvalid}
        onChange={onChange}
        options={statusList.map(s1 => { return { id: s1, name: t(`status.${s1.toLowerCase()}`) } })}
        placeholder={t('searchBar.filters.status.choose')}
        noOptionsLabel={t('searchBar.filters.status.zeroOptions')}
        textProperty="name"
        value={value}
        size={size}
        isLoading={isLoading}
    >
        {isInvalid
            ? <Form.Control.Feedback type="invalid">
                {validationMessage}
            </Form.Control.Feedback>
            : ''}
    </Select>
}

export default StatusSelect;