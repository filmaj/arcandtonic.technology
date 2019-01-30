module.exports = function (err) {
    return {
        status: 400,
        type: 'application/json',
        body: JSON.stringify({err})
    };
};
