let arc = require('@architect/functions');
let data = require('@architect/data');
let auth = require('@architect/shared/middleware/auth');
let error = require('@architect/shared/http_error');
let invalid_request = require('@architect/shared/invalid_request');
let url = arc.http.helpers.url;
let Hashids = require('hashids');
let hashids = new Hashids();

async function route (req) {
    let session = await arc.http.session.read(req);
    try {
        // get the note.title and note.body from the form post
        let note = req.body;
        if (!note) return invalid_request('empty body');
        // create the partition and sort keys
        note.accountID = session.account.accountID;
        note.noteID = hashids.encode(Date.now());
        // save the note
        await data.notes.put(note);
    } catch (e) {
        return error(e);
    }
    return {
        status: 302,
        cookie: await arc.http.session.write(session),
        location: url('/')
    };
}

exports.handler = arc.middleware(auth, route);
