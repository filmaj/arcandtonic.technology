let arc = require('@architect/functions');
let url = arc.http.helpers.url;

module.exports = async function auth (req) {
    let session = await arc.http.session.read(req);
    // if the current session is not logged in boot back to homepage
    if (!session || !session.account) {
        return {
            status: 302,
            location: url('/?plzauth=1')
        };
    }
};
