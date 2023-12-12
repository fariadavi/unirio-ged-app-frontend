const googleUserInfoURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
const googleDriveApiURL = 'https://www.googleapis.com/drive/v3';

export const getGoogleUserInfo = async (rq, token) => 
    await rq(`${googleUserInfoURL}${token}`, { method: 'GET' }, false);

export const getDriveFileInfo = async (rq, token, fileId) => 
    await rq(`${googleDriveApiURL}/files/${fileId}`, { 
        method: 'GET',  
        headers: { Authorization: `Bearer ${token}` }
    }, false);

export const getDriveFiles = async (rq, token, query) => 
    await rq(`${googleDriveApiURL}/files?q=${query}`, { 
        method: 'GET',  
        headers: { Authorization: `Bearer ${token}` }
    }, false);