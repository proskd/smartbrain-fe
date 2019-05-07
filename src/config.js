const getApiHost = (env) => {
    if (env === 'prod') {
        return '';
    } else if (env === 'dev') {
        return 'http://localhost:3001';
    }
}


module.exports = {
    getApiHost
}