let arc = require('@architect/functions');
let data = require('@architect/data');
let auth = require('@architect/shared/middleware/auth');
let error = require('@architect/shared/http_error');
let invalid_request = require('@architect/shared/invalid_request');
let url = arc.http.helpers.url;

async function route (req) {
    let session = await arc.http.session.read(req);
    let cookie = await arc.http.session.write(session);
    let location = url('/');
    try {
        let note = req.body;
        if (!note) return invalid_request('empty body');
        // TODO get param of note, retrieve note
        note.updated = new Date(Date.now()).toISOString();
        await data.notes.put(note);
    } catch (e) {
        return error(e);
    }
    return {
        status: 302,
        cookie,
        location
    };
}

exports.handler = arc.middleware(auth, route);
