import React, { useContext, useEffect, useReducer, useState } from 'react'
// import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import { getLocalItem, LANG_KEY } from '../../utils/localStorageManager'
import { getGoogleUserInfo } from '../../services/util/api'
import rq from '../../services/api'
import { Badge, Button, Form, ListGroup, Modal } from 'react-bootstrap'
import useDrivePicker from 'react-google-drive-picker'
import CategorySelect from '../util/CategorySelect'
import DatePicker from '../util/DatePicker'
import { Icon } from '../util/CustomIcon'
import { BasicButton, DeleteButton } from '../util/CustomButtons'
import DocumentImportHeaderDropdown from './DocumentImportHeaderDropdown'
import { faFileUpload, faSortAlphaDown, faSortAlphaDownAlt } from '@fortawesome/free-solid-svg-icons'
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons'
import '../../style/documents/DocumentImport.css'

const DocumentImport = () => {
    // const { t } = useTranslation();
    const [openPicker, authResult] = useDrivePicker();
    const { department } = useContext(UserContext);
    const [pickerUser, setPickerUser] = useState();
    const [categories, setCategories] = useState([]);
    const [tempFilesList, setTempFilesList] = useState([]);
    const [filesList, setFilesList] = useState([]);
    const [params, updateParams] = useReducer((prev, next) => {
        return { ...prev, ...next }
    }, {
        category: '', date: ''
    });
    const selectedFiles = filesList.filter(f => f.selected)
    const [sortProperty, setSortProperty] = useState('name');
    const [sortDirection, setSortDirection] = useState('ASC');
    const [showSelectFilesModal, setShowSelectFilesModal] = useState(false);

    useEffect(() => {
        rq('/categories', { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(cats => setCategories(cats));
    }, [department]);

    useEffect(() => {
        if (filesList.some(f => !f.token || !f.email))
            setFilesList(fl => fl.map(f => {
                return {
                    ...f,
                    token: f['token'] || authResult?.access_token,
                    email: f['email'] || pickerUser?.email,
                }
            }))
    }, [filesList, authResult?.access_token, pickerUser?.email]);

    useEffect(() => {
        const getPickerUser = async () => {
            if (!authResult?.access_token)
                return;

            const res = await getGoogleUserInfo(authResult?.access_token);
            if (!res.ok)
                return;

            return await res.json();
        }

        authResult?.access_token && getPickerUser().then(u => setPickerUser(u))
    }, [authResult]);

    const handleOpenPicker = async (switchAccount = false) =>
        openPicker({
            clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
            developerKey: process.env.REACT_APP_GOOGLE_DEVELOPER_KEY,
            token: !switchAccount && pickerUser && authResult?.access_token,
            setIncludeFolders: true,
            setSelectFolderEnabled: true,
            supportDrives: true,
            multiselect: true,
            customScopes: ['https://www.googleapis.com/auth/drive.readonly'],
            locale: getLocalItem(LANG_KEY),
            callbackFunction: (data) => {
                if (data.action === 'picked') {
                    let files = data?.docs?.filter(d =>
                        !filesList.some(f => f.id === d.id)
                    ).map(d => {
                        return {
                            ...d,
                            selected: '',
                            category: '',
                            date: ''
                        }
                    })

                    if (files.length === 0) return;

                    if (filesList.length > 0) {
                        setTempFilesList(files);
                        setShowSelectFilesModal(true);
                    } else {
                        setFilesList(files);
                    }
                }
            }
        })

    const sendSingleFile = async (itemId) => {
        let success = await uploadFiles(filesList.filter(f => f.id === itemId));
        if (!success) return;
        setFilesList(fl => fl.filter(f => f.id !== itemId));
    }

    const sendSelectedFiles = async () => {
        let success = await uploadFiles(selectedFiles);
        if (!success) return;
        setFilesList(fl => fl.filter(f => !f.selected));
    }

    const validateFilesForUpload = files => {
        if (files.length <= 0)
            return 'Error: no file for import.';

        if (files.some(f => !f.date || !f.category))
            return 'Error: all files imported must have date and category set.';

        if (files.some(f => !f.email || !f.token))
            return 'Error: info missing for file import, please add the files again.';
    }

    const uploadFiles = async (files) => {
        let validationErrors = validateFilesForUpload(files);
        if (validationErrors) {
            console.log(validationErrors);
            return false;
        }

        const res = await rq(`/documents/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(files)
        });

        if (!res.ok)
            throw new Error();

        const a = await res.text();
        console.log('Success: ' + a);
        return true;
    }

    const setItemProperty = (itemId, property, value) => {
        let fileIndex = filesList.findIndex(f => f.id === itemId);
        const { [fileIndex]: file, ...rest } = filesList;

        setFilesList(Object.values({
            ...rest,
            [fileIndex]: { ...file, [property]: value }
        }));
    }

    const setPropertyMultipleItems = (property, value, setForAll) => {
        setFilesList(fl => fl.map(f =>
            setForAll || (f[property] === '' || f[property] === 0)
                ? { ...f, [property]: value }
                : f
        ));
        updateParams({ [property]: '' });
    }

    const getSortIcon = () =>
        sortDirection === 'ASC'
            ? faSortAlphaDown
            : faSortAlphaDownAlt

    const toggleSortByColumn = key =>
        setSortDirection(key === sortProperty
            ? sortDirection === 'DESC' ? 'ASC' : 'DESC'
            : () => { setSortProperty(key); return 'ASC' }
        )

    const clearTempListAndCloseModal = () => {
        setShowSelectFilesModal(false);
        setTempFilesList([]);
    }

    const filesFromMultipleAccounts = filesList.some(f => f.email !== filesList[0].email)

    return (
        <div className="header-n-table-div">
            <h1>Import from Google Drive</h1>
            <div>
                <div className='drive-items-list'>
                    <ListGroup variant="flush" className={filesFromMultipleAccounts ? 'col6' : 'col5'}>
                        {/* header */}
                        <ListGroup.Item key="0" className='header'>
                            <Form.Check
                                type="checkbox"
                                checked={filesList.length && selectedFiles.length === filesList.length}
                                onChange={() => setFilesList(fl => fl.map(f => { return { ...f, selected: selectedFiles.length !== filesList.length } }))}
                            />
                            {filesFromMultipleAccounts &&
                                <span onClick={() => toggleSortByColumn('email')}>
                                    Conta {sortProperty === 'email' && <Icon icon={getSortIcon()} />}
                                </span>
                            }
                            <span onClick={() => toggleSortByColumn('name')}>
                                Nome {sortProperty === 'name' && <Icon icon={getSortIcon()} />}
                            </span>
                            <div className='select'>
                                <span>Categoria</span>
                                <DocumentImportHeaderDropdown
                                    labelPrimaryBtn="Set for all"
                                    labelSecondaryBtn="Set for non selected"
                                    onToggle={(isOpen, event, metadata) => { if (metadata.source === 'rootClose') updateParams({ 'category': '' }); }}
                                    onSelect={btnClicked => setPropertyMultipleItems('category', params.category, btnClicked === 'primary')}
                                    style={{ marginRight: '10px' }}
                                >
                                    <CategorySelect
                                        categories={categories}
                                        onChange={(key, value) => updateParams({ 'category': value })}
                                        size="sm"
                                        value={params.category}
                                    />
                                </DocumentImportHeaderDropdown>
                            </div>
                            <div className='select'>
                                <span>Data</span>
                                <DocumentImportHeaderDropdown
                                    labelPrimaryBtn="Set for all"
                                    labelSecondaryBtn="Set for non selected"
                                    onToggle={(isOpen, event, metadata) => { if (metadata.source === 'rootClose') updateParams({ 'date': '' }); }}
                                    onSelect={btnClicked => setPropertyMultipleItems('date', params.date, btnClicked === 'primary')}
                                    style={{ marginRight: '1rem' }}
                                >
                                    <DatePicker
                                        onChange={(key, value) => updateParams({ 'date': value })}
                                        value={params.date}
                                    />
                                </DocumentImportHeaderDropdown>
                            </div>
                            <span className='actions'>Actions</span>
                        </ListGroup.Item>

                        {/* body */}
                        {!filesList.length
                            ? <ListGroup.Item key="-1" className='empty'>
                                <span>No items selected</span>
                            </ListGroup.Item>
                            : <ListGroup variant="flush" className='content'>
                                {filesList
                                    .sort((a, b) =>
                                        sortDirection === 'ASC'
                                            ? a[sortProperty]?.localeCompare(b[sortProperty])
                                            : b[sortProperty]?.localeCompare(a[sortProperty])
                                    ).map((f, i) =>
                                        <ListGroup.Item key={i} className={filesList.all}>
                                            <Form.Check
                                                type="checkbox"
                                                checked={f.selected}
                                                onChange={() => setItemProperty(f.id, 'selected', !f.selected)}
                                            />
                                            {filesFromMultipleAccounts && <span>{f.email}</span>}
                                            <span>{f.name}</span>
                                            <div>
                                                <CategorySelect
                                                    categories={categories}
                                                    onChange={(key, value) => setItemProperty(f.id, 'category', value)}
                                                    size="sm"
                                                    value={f.category}
                                                />
                                            </div>
                                            <div>
                                                <DatePicker
                                                    onChange={(key, value) => setItemProperty(f.id, 'date', value)}
                                                    size="sm"
                                                    value={f.date}
                                                />
                                            </div>
                                            <div className="actions">
                                                {validateFilesForUpload([f])
                                                    ? <BasicButton
                                                        className="disabled"
                                                        icon={faFileUpload}
                                                        onClick={() => {}}
                                                        tooltip='upload single file btn'
                                                    />
                                                    : <BasicButton
                                                        icon={faFileUpload}
                                                        onClick={() => sendSingleFile(f.id)}
                                                        tooltip='upload single file btn'
                                                    />
                                                }
                                                <DeleteButton
                                                    onClick={() => setFilesList(fl => fl.filter(file => file.id !== f.id))}
                                                    i18nTooltipKey='delete file btn i18n key'
                                                />
                                            </div>
                                        </ListGroup.Item>
                                    )}
                            </ListGroup>
                        }
                    </ListGroup>
                </div>

                <div className={`page-btns ${!filesList.length ? 'center' : 'full'}`}>
                    <div className='select-from-drive-btn'>
                        <Button variant="primary" onClick={() => handleOpenPicker()}>
                            <Icon icon={faGoogleDrive} />
                            <span>Select from Google Drive</span>
                        </Button>

                        {!!pickerUser &&
                            <div className='current-user-box'>
                                <span >{pickerUser.email} - </span>
                                <Button
                                    variant="link"
                                    onClick={() => { setPickerUser(); handleOpenPicker(true); }}
                                >
                                    Switch account
                                </Button>
                            </div>
                        }
                    </div>

                    {!!filesList.length &&
                        <div className='files-action-btns-box'>
                            <Button
                                className='import-selected-btn'
                                variant={selectedFiles.length ? "primary" : "secondary"}
                                onClick={() => setFilesList(fl => fl.filter(f => !f.selected))}
                                disabled={selectedFiles.length === 0}
                            >
                                <span>Remove selected</span>
                                <Badge variant='light'>
                                    {selectedFiles.length || ''}
                                </Badge>
                            </Button>
                            <Button
                                className='import-selected-btn'
                                variant={selectedFiles.length ? "primary" : "secondary"}
                                onClick={() => sendSelectedFiles()}
                                disabled={selectedFiles.length === 0}
                            >
                                <span>Import selected</span>
                                <Badge variant='light'>
                                    {selectedFiles.length || ''}
                                </Badge>
                            </Button>
                        </div>
                    }
                </div>
            </div>

            <Modal
                backdrop="static"
                className="selectFilesModal"
                show={showSelectFilesModal}
                onEscapeKeyDown={clearTempListAndCloseModal}
                onHide={clearTempListAndCloseModal}
            >
                <Modal.Header closeButton={true}>
                    <h5 className="title">Atenção</h5>
                </Modal.Header>
                <Modal.Body>
                    Já existe uma lista de arquivos selecionados para importação.
                    <br /><br />
                    Deseja adicionar os novos itens à lista ou substituir todos?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={clearTempListAndCloseModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => { setFilesList([...filesList, ...tempFilesList.filter(f => !filesList.some(f2 => f2.id === f.id))]); clearTempListAndCloseModal(); }}>
                        Adicionar
                    </Button>
                    <Button variant="primary" onClick={() => { setFilesList(tempFilesList); clearTempListAndCloseModal(); }}>
                        Substituir
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default DocumentImport;