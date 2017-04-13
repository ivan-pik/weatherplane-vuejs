export const saveToken = function(token) {
    localStorage.setItem('id_token', token);
}

export const checkAuth = function() {
    var jwt = localStorage.getItem('id_token');
    if(jwt) {
        return true;
    }
    else {
        return false;
    }
}

export const getLocalToken = function() {
    var jwt = localStorage.getItem('id_token');
    if(jwt) return {
        token: jwt
    };
    else {
        return false;
    }
}