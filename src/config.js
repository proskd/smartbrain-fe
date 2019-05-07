const getApiHost = (env) => {
    if (env === 'prod') {
        return 'https://smart-brain-api-proskd.herokuapp.com';
    } else if (env === 'dev') {
        return 'http://localhost:3001';
    }
}


module.exports = {
    getApiHost
}