module.exports = function (err) {
    return {
        status: 500,
        type: 'application/json',
        body: JSON.stringify(err)
    };
};
