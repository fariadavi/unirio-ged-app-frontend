const googleUserInfoURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';

export const getGoogleUserInfo = async token => 
    await fetch(`${googleUserInfoURL}${token}`, { method: 'GET' });