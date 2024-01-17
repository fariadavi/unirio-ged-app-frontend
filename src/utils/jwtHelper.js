const decodeToken = jwt => {
    try {
        return jwt
            ? JSON.parse(window.atob(jwt.split(".")[1]))
            : null
    } catch {
        return null
    }
};

const getTokenExpiration = jwt => decodeToken(jwt)?.exp;

const getMillisLeftUntilTokenExpirarion = jwt => {
    let jwtExp = getTokenExpiration(jwt);
    return jwtExp ? (jwtExp * 1000) - Date.now() : null;
}

export const getTokenDetails = jwt => {
    let millis = getMillisLeftUntilTokenExpirarion(jwt);
    return {
        jwt: jwt,
        msUntilTokenExp: millis,
        isTokenAboutToExpire: millis < (5 * 60 * 1000), /* 5min */
        isTokenExpired: millis <= 0
    };
};