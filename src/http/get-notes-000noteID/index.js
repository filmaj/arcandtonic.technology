let arc = require('@architect/functions');
let data = require('@architect/data');
let layout = require('@architect/shared/views/layout');
let auth = require('@architect/shared/middleware/auth');
let url = arc.http.helpers.url;
let form = require('./_form');

async function route (req) {
    let title = 'welcome home';
    let noteID = req.params.noteID;

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
    let href = `/notes/${noteID}`;
    note.href = url(href);
    // build out the templates
    let body = form(note);
    let html = layout({body, title, session, path: href});
    // send the response
    return {
        status: 200,
        cookie: await arc.http.session.write(session),
        type: 'text/html',
        body: html
    };
}

exports.handler = arc.middleware(auth, route);
