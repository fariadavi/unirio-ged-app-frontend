import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import { getLocalItem, LANG_KEY } from '../../utils/localStorageManager'
import { getDriveFileInfo, getDriveFiles, getGoogleUserInfo } from '../../services/util/api'
import rq from '../../services/api'
import { Badge, Button, Form, ListGroup, Modal } from 'react-bootstrap'
import useDrivePicker from 'react-google-drive-picker'
import CategorySelect from '../util/CategorySelect'
import DatePicker from '../util/DatePicker'
import { Icon } from '../util/CustomIcon'
import { BasicButton, DeleteButton } from '../util/CustomButtons'
import DocumentImportHeaderDropdown from './DocumentImportHeaderDropdown'
import LoadButton from '../util/LoadButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faFileUpload, faSortAlphaDown, faSortAlphaDownAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons'
import { NotificationType } from '../notification/Notifications'
import '../../style/documents/DocumentImport.css'

const DocumentImport = () => {
    const { t } = useTranslation();
    const [openPicker, authResult] = useDrivePicker();
    const { department } = useContext(UserContext);
    const { pushNotification } = useContext(NotificationContext);
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
    const [isSelectingFiles, setSelectingFiles] = useState(false);
    const [fileIdUploadList, setFileIdUploadList] = useState([]);
    const [fileValidationMap, setFileValidationMap] = useState({});

    useEffect(() => {
        setFileList(fl => fl.map(f => { return { ...f, category: '' }}));

        rq('/categories?fullName=true', { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(cats => setCategories(cats));
    }, [department]);

    const filterArray = (array, predicate) => {
        return [
            array.filter(a => predicate(a)),
            array.filter(a => !predicate(a))
        ]
    }

    const queryGoogleDriveFiles = useCallback(async searchQuery => {
        const fieldsQuery = '&fields=files(id,name,mimeType,description,fileExtension,parents,createdTime)';
        const res = await getDriveFiles(authResult?.access_token, searchQuery + fieldsQuery);

        if (!res.ok)
            throw new Error();

        const json = await res.json();

        return json.files;
    }, [authResult?.access_token])

    const getFilesFromFolders = useCallback(async folderIds => {
        if (!folderIds.length) return [];

        const searchQuery = folderIds.map(fi => `'${fi}' in parents`).join(' OR ');
        return queryGoogleDriveFiles(searchQuery);
    }, [queryGoogleDriveFiles])

    const getFilesDetails = useCallback(async filesIds => {
        if (!filesIds.length) return [];

        const fieldsQuery = '?fields=id,name,mimeType,description,fileExtension,parents,createdTime';

        const filesRes = await Promise.all(filesIds.map(fId => getDriveFileInfo(authResult?.access_token, fId + fieldsQuery)));
        return await Promise.all(filesRes.map(res => res.json()));
    }, [authResult?.access_token])

    const getFilesFromShortcuts = useCallback(async shortcutIds => {
        if (!shortcutIds.length) return [];

        const fieldsQuery = '?fields=id,shortcutDetails';

        const shortcutsRes = await Promise.all(shortcutIds.map(sId => getDriveFileInfo(authResult?.access_token, sId + fieldsQuery)));
        const shortcuts = await Promise.all(shortcutsRes.map(res => res.json()));
        const targetFiles = shortcuts.filter(s => s.shortcutDetails?.targetId).map(s => s.shortcutDetails.targetId)

        return await getFilesDetails(targetFiles);
    }, [authResult?.access_token, getFilesDetails])

    const mapFileFromDocument = useCallback(doc => {
        return {
            ...doc,
            type: doc.type ||
                (doc.mimeType === 'application/vnd.google-apps.folder'
                    ? 'folder'
                    : (doc.fileExtension ? 'file' : 'document')),
            selected: '',
            category: '',
            date: doc.createdTime?.split('T')?.[0] || '',
            processed: false,
            email: pickerUser?.email,
            token: authResult?.access_token
        }
    }, [authResult?.access_token, pickerUser?.email])

    const isFolder = doc => doc.type === 'folder' || doc.mimeType === 'application/vnd.google-apps.folder';
    const isShortcut = doc => doc.type === 'shortcut' || doc.mimeType === 'application/vnd.google-apps.shortcut';

    useEffect(() => {
        if (showSelectFilesModal || !tempFileList.length) return;

        if (tempFileList.some(t => !t.processed)) {
            let [processed, pending] = filterArray(tempFileList, t => t.processed);
            let [folders, rest] = filterArray(pending, isFolder);
            let [shortcuts, files] = filterArray(rest, isShortcut);

            let filesDetails = getFilesDetails(files.map(f => f.id));
            let filesFromFolders = getFilesFromFolders(folders.map(f => f.id));
            let filesFromShortcuts = getFilesFromShortcuts(shortcuts.map(s => s.id));

            Promise.all([
                filesDetails,
                filesFromFolders,
                filesFromShortcuts
            ]).then(([f1, f2, f3]) => setTempFileList([
                ...processed,
                ...f1?.map(f => { return { ...mapFileFromDocument(f), processed: true } }),
                ...f2?.map(f => { return { ...mapFileFromDocument(f), processed: !isFolder(f) && !isShortcut(f) } }),
                ...f3?.map(f => { return { ...mapFileFromDocument(f), processed: !isFolder(f) && !isShortcut(f) } })
            ]))
        } else {
            setFileList(fl => [
                ...fl,
                ...tempFileList.filter(d =>
                    !fl.some(f => f.id === d.id)
                ).map(mapFileFromDocument)
            ]);
            setTempFileList([]);
            setSelectingFiles(false);
        }
    }, [getFilesDetails, getFilesFromFolders, getFilesFromShortcuts, mapFileFromDocument, showSelectFilesModal, tempFileList]);

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
            );

            if (files.length === 0) return;

            if (fileList.length > 0)
                setShowSelectFilesModal(true);

            setTempFileList(files.map(mapFileFromDocument));
        } else if (data.action === 'loaded') {
            setSelectingFiles(true);
        } else if (data.action === 'cancel') {
            setSelectingFiles(false);
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
        let fileInArray = fileList.filter(f => f.id === itemId);
        let invalidFiles = validateFilesForUpload(fileInArray);
        if (invalidFiles.length > 0) return;

        setFileIdUploadList(fl => [...fl, itemId]);
        let success = await uploadFiles(fileInArray);
        setFileIdUploadList(fl => fl.filter(f => f !== itemId));

        if (!success) return;
        setFileList(fl => fl.filter(f => f.id !== itemId));
    }

    const sendSelectedFiles = async () => {
        let invalidFiles = validateFilesForUpload(selectedFiles);
        if (invalidFiles.length === selectedFiles.length) return;

        let validFiles = selectedFiles.filter(f => invalidFiles.every(([invalidId, _]) => invalidId !== f.id));
        let validFilesIds = validFiles.map(f => f.id);

        setFileIdUploadList(fl => [...fl, ...validFilesIds]);
        let success = await uploadFiles(validFiles);
        setFileIdUploadList(fl => fl.filter(f => validFilesIds.every(f2 => f2 !== f)));

        if (!success) return;
        setFileList(fl => fl.filter(f => !validFilesIds.includes(f.id)));
    }

    const validateFilesForUpload = files => {
        let validationArray = getFilesValidationArray(files);
        setFileValidationMap(Object.fromEntries(validationArray));

        return validationArray;
    }

    const getFilesValidationArray = files =>
        files
            .map(f => [f.id, getFileValidation(f)])
            .filter(([_, v]) => v.length > 0)

    const getFileValidation = f => [
        // !f.date ? 'date' : '',
        !f.category ? 'category' : '',
        (!f.email || !f.token) ? 'info' : '',
    ].filter(s => s !== '')

    const isFileValid = file => !getFileValidation(file).length

    const uploadFiles = async (files) => {
        try {
            const res = await rq(`/documents/import`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(files)
            });

            if (!res.ok) throw new Error();

            await res.text();
            pushNotification(NotificationType.INFO, 'document.import.upload.success');
            return true;
        } catch (err) {
            pushNotification(NotificationType.ERROR, 'document.import.upload.fail');
        }
    }

    const setItemProperty = (itemId, property, value) => {
        let fileIndex = fileList.findIndex(f => f.id === itemId);
        const { [fileIndex]: file, ...rest } = fileList;

        setFileList(Object.values({
            ...rest,
            [fileIndex]: { ...file, [property]: value }
        }));

        if (!value || !fileValidationMap[itemId]?.includes(property)) return;
        setFileValidationMap(fvm => {
            const { [itemId]: validations, ...rest } = fvm;
            let newValidations = validations.filter(v => v !== property);

            return newValidations.length > 0
                ? { ...rest, [itemId]: newValidations }
                : { ...rest };
        })
    }

    const setPropertyMultipleItems = (property, value, setForAll) => {
        setFileList(fl => fl.map(f =>
            setForAll || (f[property] === '' || f[property] === 0)
                ? { ...f, [property]: value }
                : f
        ));
        updateParams({ [property]: '' });

        if (!value) return;
        setFileValidationMap(fvm => {
            let itemsWithMissingProperty = Object.entries(fvm).filter(([k, v]) => v.includes(property));
            if (!itemsWithMissingProperty.length) return fvm;

            let newValidationMap = fvm;
            itemsWithMissingProperty.forEach(([k, v]) => {
                const { [k]: _, ...rest } = newValidationMap;
                let newValidations = v.filter(v => v !== property);

                newValidationMap = newValidations.length > 0
                    ? { ...rest, [k]: newValidations }
                    : { ...rest };
            });

            return newValidationMap;
        });
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
                                {isSelectingFiles
                                    ? <FontAwesomeIcon icon={faCircleNotch} className="faSpin" />
                                    : <span>{t('import.table.content.empty')}</span>}
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
                                            <div className={"column-document-name " + (fileValidationMap[f.id]?.includes('info') ? "import-info-error-box" : "")}>
                                                <span>{f.name}</span>
                                                {fileValidationMap[f.id]?.includes('info')
                                                    ? <>
                                                        <FontAwesomeIcon icon={faExclamationTriangle} className="faWarn" />

                                                        <span className="import-info-error-msg">
                                                            {t('import.table.content.validation.info')}
                                                        </span>
                                                    </>
                                                    : <></>}
                                            </div>
                                            <div>
                                                <CategorySelect
                                                    categories={categories}
                                                    isInvalid={fileValidationMap[f.id]?.includes('category')}
                                                    onChange={(_, value) => setItemProperty(f.id, 'category', value)}
                                                    size="sm"
                                                    value={f.category}
                                                />
                                            </div>
                                            <div>
                                                <DatePicker
                                                    isInvalid={fileValidationMap[f.id]?.includes('date')}
                                                    onChange={(_, value) => setItemProperty(f.id, 'date', value)}
                                                    size="sm"
                                                    value={f.date}
                                                />
                                            </div>
                                            <div className="actions">
                                                {fileIdUploadList.some(f2 => f2 === f.id)
                                                    ? <FontAwesomeIcon icon={faCircleNotch} className="faSpin" style={{ marginTop: '.5rem' }} />
                                                    : <>
                                                        <BasicButton
                                                            className={!isFileValid(f) ? 'disabled' : ''}
                                                            icon={faFileUpload}
                                                            onClick={() => { if (isFileValid(f)) sendSingleFile(f.id) }}
                                                            tooltip={t('import.table.content.actions.import')} />
                                                        <DeleteButton onClick={() => setFileList(fl => fl.filter(file => file.id !== f.id))} />
                                                    </>
                                                }
                                            </div>
                                        </ListGroup.Item>
                                    )}
                            </ListGroup>
                        }
                    </ListGroup>
                </div>

                <div className={`page-btns ${!visibleFileList.length ? 'center' : 'full'}`}>
                    <div className="select-from-drive-btn">
                        <LoadButton isLoading={isSelectingFiles} onClick={() => handleOpenPicker()}>
                            <Icon icon={faGoogleDrive} />
                            <span>{t('import.page.btns.selectFromDrive')}</span>
                        </LoadButton>

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
                                disabled={selectedFiles.length === 0 || fileIdUploadList.length > 0}
                            >
                                <span>{t('import.page.btns.removeSelected')}</span>
                                <Badge variant="light">
                                    {selectedFiles.length || ''}
                                </Badge>
                            </Button>
                            <LoadButton
                                className="import-selected-btn"
                                variant={selectedFiles.length ? 'primary' : 'secondary'}
                                onClick={() => sendSelectedFiles()}
                                disabled={selectedFiles.length === 0}
                                isLoading={fileIdUploadList.length > 0}
                            >
                                <span>{t('import.page.btns.importSelected')}</span>
                                <Badge variant="light">
                                    {selectedFiles.length || ''}
                                </Badge>
                            </LoadButton>
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