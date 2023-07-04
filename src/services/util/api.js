const googleUserInfoURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
const googleDriveApiURL = 'https://www.googleapis.com/drive/v3';

export const getGoogleUserInfo = async token => 
    await fetch(`${googleUserInfoURL}${token}`, { method: 'GET' });

export const getDriveFileInfo = async (token, fileId) => 
    await fetch(`${googleDriveApiURL}/files/${fileId}`, { 
        method: 'GET',  
        headers: { Authorization: `Bearer ${token}`  } 
    });

export const getDriveFiles = async (token, query) => 
    await fetch(`${googleDriveApiURL}/files?q=${query}`, { 
        method: 'GET',  
        headers: { Authorization: `Bearer ${token}`  } 
    });