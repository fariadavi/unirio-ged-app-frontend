import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
    const { t } = useTranslation();
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
        rq('/categories?fullName=true', { method: 'GET' })
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
            let [processed, pending] = filterArray(tempFileList, t => t.processed)

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
            <h1>{t('import.page.title')}</h1>
            {!!tempFileList.length && "Loading..."}
            <div>
                <div className="drive-items-list">
                    <ListGroup variant="flush" className={filesFromMultipleAccounts ? 'col6' : 'col5'}>
                        {/* header */}
                        <ListGroup.Item key="0" className="header">
                            <Form.Check
                                type="checkbox"
                                checked={visibleFileList.length && selectedFiles.length === visibleFileList.length}
                                onChange={() => setFileList(fl => fl.map(f => { return { ...f, selected: selectedFiles.length !== visibleFileList.length } }))}
                            />
                            {filesFromMultipleAccounts &&
                                <span onClick={() => toggleSortByColumn('email')}>
                                    {t('import.table.headers.account')} {sortProperty === 'email' && <Icon icon={getSortIcon()} />}
                                </span>
                            }
                            <span onClick={() => toggleSortByColumn('name')}>
                                {t('import.table.headers.name')} {sortProperty === 'name' && <Icon icon={getSortIcon()} />}
                            </span>
                            <div className="select">
                                <span>{t('import.table.headers.category')}</span>
                                <DocumentImportHeaderDropdown
                                    labelPrimaryBtn={t('import.table.headers.popover.btns.primary.label')}
                                    labelSecondaryBtn={t('import.table.headers.popover.btns.secondary.label')}
                                    onToggle={(_, __, metadata) => { if (metadata.source === 'rootClose') updateParams({ 'category': '' }); }}
                                    onSelect={btnClicked => setPropertyMultipleItems('category', params.category, btnClicked === 'primary')}
                                    style={{ marginRight: '10px' }}
                                >
                                    <CategorySelect
                                        categories={categories}
                                        onChange={(_, value) => updateParams({ 'category': value })}
                                        size="sm"
                                        value={params.category}
                                    />
                                </DocumentImportHeaderDropdown>
                            </div>
                            <div className="select">
                                <span>{t('import.table.headers.date')}</span>
                                <DocumentImportHeaderDropdown
                                    labelPrimaryBtn={t('import.table.headers.popover.btns.primary.label')}
                                    labelSecondaryBtn={t('import.table.headers.popover.btns.secondary.label')}
                                    onToggle={(_, __, metadata) => { if (metadata.source === 'rootClose') updateParams({ 'date': '' }); }}
                                    onSelect={btnClicked => setPropertyMultipleItems('date', params.date, btnClicked === 'primary')}
                                    style={{ marginRight: '1rem' }}
                                >
                                    <DatePicker
                                        onChange={(_, value) => updateParams({ 'date': value })}
                                        value={params.date}
                                    />
                                </DocumentImportHeaderDropdown>
                            </div>
                            <span className="actions">{t('import.table.headers.actions')}</span>
                        </ListGroup.Item>

                        {/* body */}
                        {!visibleFileList.length
                            ? <ListGroup.Item key="-1" className="empty">
                                <span>{t('import.table.content.empty')}</span>
                            </ListGroup.Item>
                            : <ListGroup variant="flush" className="content">
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
                                                    onChange={(_, value) => setItemProperty(f.id, 'category', value)}
                                                    size="sm"
                                                    value={f.category}
                                                />
                                            </div>
                                            <div>
                                                <DatePicker
                                                    onChange={(_, value) => setItemProperty(f.id, 'date', value)}
                                                    size="sm"
                                                    value={f.date}
                                                />
                                            </div>
                                            <div className="actions">
                                                <BasicButton
                                                    className={validateFilesForUpload([f]) ? 'disabled' : ''}
                                                    icon={faFileUpload}
                                                    onClick={() => { if (!validateFilesForUpload([f])) sendSingleFile(f.id) }}
                                                    tooltip={t('import.table.content.actions.import')} />
                                                <DeleteButton onClick={() => setFileList(fl => fl.filter(file => file.id !== f.id))} />
                                            </div>
                                        </ListGroup.Item>
                                    )}
                            </ListGroup>
                        }
                    </ListGroup>
                </div>

                <div className={`page-btns ${!visibleFileList.length ? 'center' : 'full'}`}>
                    <div className="select-from-drive-btn">
                        <Button variant="primary" onClick={() => handleOpenPicker()}>
                            <Icon icon={faGoogleDrive} />
                            <span>{t('import.page.btns.selectFromDrive')}</span>
                        </Button>

                        {!!pickerUser &&
                            <div className="current-user-box">
                                <span >{pickerUser.email} - </span>
                                <Button
                                    variant="link"
                                    onClick={() => { setPickerUser(); handleOpenPicker(true); }}
                                >
                                    {t('import.page.btns.switchAccount')}
                                </Button>
                            </div>
                        }
                    </div>

                    {!!visibleFileList.length &&
                        <div className="files-action-btns-box">
                            <Button
                                className="import-selected-btn"
                                variant={selectedFiles.length ? 'primary' : 'secondary'}
                                onClick={() => setFileList(fl => fl.filter(f => !f.selected))}
                                disabled={selectedFiles.length === 0}
                            >
                                <span>{t('import.page.btns.removeSelected')}</span>
                                <Badge variant="light">
                                    {selectedFiles.length || ''}
                                </Badge>
                            </Button>
                            <Button
                                className="import-selected-btn"
                                variant={selectedFiles.length ? 'primary' : 'secondary'}
                                onClick={() => sendSelectedFiles()}
                                disabled={selectedFiles.length === 0}
                            >
                                <span>{t('import.page.btns.importSelected')}</span>
                                <Badge variant="light">
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
                    <h5 className="title">{t('import.warningModal.title')}</h5>
                </Modal.Header>
                <Modal.Body>
                    {t('import.warningModal.body.line1')}
                    <br /><br />
                    {t('import.warningModal.body.line2')}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setTempFileList([]); setShowSelectFilesModal(false); }}>
                        {t('import.warningModal.btns.cancel')}
                    </Button>
                    <Button variant="primary" onClick={() => { setShowSelectFilesModal(false); }}>
                        {t('import.warningModal.btns.append')}
                    </Button>
                    <Button variant="primary" onClick={() => { setFileList([]); setShowSelectFilesModal(false); }}>
                        {t('import.warningModal.btns.replace')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default DocumentImport;