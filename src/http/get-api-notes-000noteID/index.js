let arc = require('@architect/functions');
let data = require('@architect/data');
let auth = require('@architect/shared/middleware/auth');

async function route (req) {
    let session = await arc.http.session.read(req);
    let accountID = session.account.accountID;
    let note = await data.notes.get({noteID, accountID});
    if (!note || !note.noteID) {
        return {
            status: 404,
            cookie: await arc.http.session.write(session),
            type: 'application/json',
            body: JSON.stringify({err: `note with ID ${noteID} not found under your account!`})
        };
    }
    return {
        status: 200,
        cookie: await arc.http.session.write(session),
        type: 'application/json',
        body: JSON.stringify(note)
    };
}

exports.handler = arc.middleware(auth, route);
