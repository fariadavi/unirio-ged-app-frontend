import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react'
// import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import { getLocalItem, LANG_KEY } from '../../utils/localStorageManager'
import { getDriveFiles, getGoogleUserInfo } from '../../services/util/api'
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
    const [tempFileList, setTempFileList] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [params, updateParams] = useReducer((prev, next) => {
        return { ...prev, ...next }
    }, {
        category: '', date: ''
    });
    const selectedFiles = fileList.filter(f => f.selected)
    const [sortProperty, setSortProperty] = useState('name');
    const [sortDirection, setSortDirection] = useState('ASC');
    const [showSelectFilesModal, setShowSelectFilesModal] = useState(false);

    useEffect(() => {
        rq('/categories', { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(cats => setCategories(cats));
    }, [department]);
    
    const filterArray = (array, predicate) => {
        return [array.filter(a => predicate(a)), array.filter(a => !predicate(a))]
    }

    const getFilesFromParentFolders = useCallback(async folderIds => {
        const searchQuery = folderIds.map(fi => `'${fi}' in parents`).join(' OR ');
        const fieldsQuery = '&fields=files(id,name,mimeType,description,fileExtension,parents)';
        const res = await getDriveFiles(authResult?.access_token, searchQuery + fieldsQuery);

        if (!res.ok)
            throw new Error();

        const json = await res.json();

        return json.files;
    }, [authResult?.access_token])

    const mapFileFromDocument = useCallback(doc => {
        return {
            ...doc,
            type: doc.type ||
                (doc.mimeType === 'application/vnd.google-apps.folder'
                    ? 'folder'
                    : (doc.fileExtension ? 'file' : 'document')),
            selected: '',
            category: '',
            date: '',
            processed: doc.type !== 'folder' && doc.mimeType !== 'application/vnd.google-apps.folder',
            email: pickerUser?.email,
            token: authResult?.access_token
        }
    }, [authResult?.access_token, pickerUser?.email])

    useEffect(() => {
        if (showSelectFilesModal || !tempFileList.length) return;

        if (tempFileList.some(t => !t.processed)) {
            let [ processed, pending ] = filterArray(tempFileList, t => t.processed)

            getFilesFromParentFolders(
                pending.map(t => t.id)
            ).then(fl => setTempFileList([
                ...processed,
                ...fl.map(mapFileFromDocument)
            ]))
        }

        if (!tempFileList.some(t => !t.processed)) {
            setFileList(fl => [
                ...fl,
                ...tempFileList.map(mapFileFromDocument)
            ]);
            setTempFileList([]);
        }
    }, [getFilesFromParentFolders, mapFileFromDocument, showSelectFilesModal, tempFileList]);

    useEffect(() => {
        if (!authResult?.access_token) return;

        const getPickerUser = async () => {
            const res = await getGoogleUserInfo(authResult?.access_token);
            return res.ok && await res.json();
        }

        getPickerUser().then(u => {
            setPickerUser(u);

            //update tokens of docs in the list that belong to the same user
            setFileList(fl => {
                let filesFromUserWithOldTokenPredicate = f => f.email === u?.email && f.token !== authResult?.access_token;
                let [filesWithOutdatedToken, rest] = filterArray(fl, filesFromUserWithOldTokenPredicate);
                return [
                    ...filesWithOutdatedToken.map(f => { return { ...f, token: authResult?.access_token } }),
                    ...rest
                ]
            })
        });
    }, [authResult]);

    const pickerCallback = data => {
        if (data.action === 'picked') {
            let files = data?.docs?.filter(d =>
                !fileList.some(f => f.id === d.id)
            ).map(mapFileFromDocument);

            if (files.length === 0) return;

            if (fileList.length > 0)
                setShowSelectFilesModal(true);

            setTempFileList(files);
        }
    }

    const handleOpenPicker = (switchAccount = false) =>
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
            callbackFunction: pickerCallback
        })

    const sendSingleFile = async (itemId) => {
        let success = await uploadFiles(fileList.filter(f => f.id === itemId));
        if (!success) return;
        setFileList(fl => fl.filter(f => f.id !== itemId));
    }

    const sendSelectedFiles = async () => {
        let success = await uploadFiles(selectedFiles);
        if (!success) return;
        setFileList(fl => fl.filter(f => !f.selected));
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
        let fileIndex = fileList.findIndex(f => f.id === itemId);
        const { [fileIndex]: file, ...rest } = fileList;

        setFileList(Object.values({
            ...rest,
            [fileIndex]: { ...file, [property]: value }
        }));
    }

    const setPropertyMultipleItems = (property, value, setForAll) => {
        setFileList(fl => fl.map(f =>
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

    const visibleFileList = fileList.filter(f => f.email)

    const filesFromMultipleAccounts = visibleFileList.some(f => f.email !== visibleFileList[0]?.email)

    return (
        <div className="header-n-table-div">
            <h1>Import from Google Drive</h1>
            {!!tempFileList.length && "Loading..."}
            <div>
                <div className='drive-items-list'>
                    <ListGroup variant="flush" className={filesFromMultipleAccounts ? 'col6' : 'col5'}>
                        {/* header */}
                        <ListGroup.Item key="0" className='header'>
                            <Form.Check
                                type="checkbox"
                                checked={visibleFileList.length && selectedFiles.length === visibleFileList.length}
                                onChange={() => setFileList(fl => fl.map(f => { return { ...f, selected: selectedFiles.length !== visibleFileList.length } }))}
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
                        {!visibleFileList.length
                            ? <ListGroup.Item key="-1" className='empty'>
                                <span>No items selected</span>
                            </ListGroup.Item>
                            : <ListGroup variant="flush" className='content'>
                                {visibleFileList
                                    .filter(f => f.token)
                                    .sort((a, b) => sortDirection === 'ASC'
                                        ? a[sortProperty]?.localeCompare(b[sortProperty])
                                        : b[sortProperty]?.localeCompare(a[sortProperty])
                                    ).map((f, i) =>
                                        <ListGroup.Item key={i}>
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
                                                        onClick={() => { }}
                                                        tooltip='upload single file btn'
                                                    />
                                                    : <BasicButton
                                                        icon={faFileUpload}
                                                        onClick={() => sendSingleFile(f.id)}
                                                        tooltip='upload single file btn'
                                                    />}
                                                <DeleteButton
                                                    onClick={() => setFileList(fl => fl.filter(file => file.id !== f.id))}
                                                    i18nTooltipKey='delete file btn i18n key'
                                                />
                                            </div>
                                        </ListGroup.Item>
                                    )}
                            </ListGroup>
                        }
                    </ListGroup>
                </div>

                <div className={`page-btns ${!visibleFileList.length ? 'center' : 'full'}`}>
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

                    {!!visibleFileList.length &&
                        <div className='files-action-btns-box'>
                            <Button
                                className='import-selected-btn'
                                variant={selectedFiles.length ? "primary" : "secondary"}
                                onClick={() => setFileList(fl => fl.filter(f => !f.selected))}
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
                onEscapeKeyDown={() => { setTempFileList([]); setShowSelectFilesModal(false); }}
                onHide={() => { setTempFileList([]); setShowSelectFilesModal(false); }}
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
                    <Button variant="secondary" onClick={() => { setTempFileList([]); setShowSelectFilesModal(false); }}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => { setShowSelectFilesModal(false); }}>
                        Adicionar
                    </Button>
                    <Button variant="primary" onClick={() => { setFileList([]); setShowSelectFilesModal(false); }}>
                        Substituir
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default DocumentImport;