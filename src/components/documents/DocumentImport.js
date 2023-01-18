import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import { AuthContext } from '../../contexts/AuthContext'
import useDrivePicker from 'react-google-drive-picker'
import CategorySelect from '../util/CategorySelect'
import { getLocalItem, isTokenExpired, LANG_KEY } from '../../utils/localStorageManager'

const DocumentImport = () => {
    const { t } = useTranslation();
    const [openPicker, authResult] = useDrivePicker();
    const { token, handleAuthLogout } = useContext(AuthContext);
    const [category, setCategory] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filesList, setFilesList] = useState([]);

    const handleOpenPicker = () => {
        if (isTokenExpired(token)) handleAuthLogout();        
        
        let googleToken = getLocalItem(GOOGLE_TOKEN_KEY);
        if (!googleToken) {
            console.log('Hey User, you might have to re-login to the system.');
            return;
        }

    const handleOpenPicker = async () => {
        if (isTokenExpired(token)) handleAuthLogout();

        openPicker({
            clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
            developerKey: process.env.REACT_APP_GOOGLE_DEVELOPER_KEY,
            token: authResult?.access_token,
            setIncludeFolders: true,
            setSelectFolderEnabled: true,
            supportDrives: true,
            multiselect: true,
            customScopes: ['https://www.googleapis.com/auth/drive.readonly'],
            locale: getLocalItem(LANG_KEY),
            callbackFunction: (data) => {
                console.log(data)
                if (data.action === 'picked') {
                    setSelectedFiles(data.docs);
                }
            },
        })
    }

    const sendSelectedFiles = async () => {
        const res = await rq(`/documents/import?category=${category}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': authResult?.access_token
            },
            body: JSON.stringify(filesList)
        });

        if (!res.ok)
            throw new Error();

        const a = await res.text();
        console.log('Success: ' + a);

        setSelectedFiles([]);
    }

    useEffect(() => {
        if (selectedFiles.length) return;
        debugger;
        // selectedFiles.filter(x => { })
        setFilesList([...selectedFiles]);
    }, [selectedFiles]);

    return (
        <div className="document-details-page">
            <div className="document-form">

                <h1>Import from Google Drive</h1>
                {selectedFiles.length > 0
                    && <>
                        <ul>
                            <p>Selected from Google Drive:</p>
                            {selectedFiles.map((x, i) =>
                                <li key={i}>{i + 1}: {x.name} - {x.type}</li>
                            )}
                        </ul>
                    </>}

                <br />
                <button onClick={() => handleOpenPicker()}>
                    Open Picker
                </button>

                <br />
                <CategorySelect
                    label={t('category')}
                    onChange={(key, value) => setCategory(value)}
                    value={category}
                />

                <br />
                <button onClick={() => sendSelectedFiles()} disabled={selectedFiles.length === 0}>
                    Upload selected files to server
                </button>
            </div>
        </div>
    )
}

export default DocumentImport;