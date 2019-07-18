let arc = require('@architect/functions');
let url = arc.http.helpers.url;
let data = require('@architect/data');
let auth = require('@architect/shared/middleware/auth');
let responder = require('@architect/shared/responder');
let logger = require('@architect/shared/logger')('POST /api/notes');
let Hashids = require('hashids');
let hashids = new Hashids();

async function route (req) {
  let session = await arc.http.session.read(req);
  try {
    // get the note.title and note.body from the form post
    let payload = req.body;
    if (!payload || !payload.note) {
      return responder(req, {
        statusCode: 400,
        body: {error: 'empty request body or note property'}
      });
    }
    // create the partition and sort keys
    let note = {
      accountID: session.account.accountID,
      noteID: hashids.encode(Date.now()),
      note: payload.note
    };
    // save the note
    await data.notes.put(note);
    logger(`${note.accountID} created a note`);
    return responder(req, {
      statusCode: 200,
      headers: {
        'set-cookie': await arc.http.session.write(session),
        location: url('/')
      },
      body: note
    });
  } catch (e) {
    logger(`${session.account.accountID} exception! ${e.message}`);
    return responder(req, {
      statusCode: 500,
      body: {error: e.message}
    });
  }
}

exports.handler = arc.middleware(auth, route);
