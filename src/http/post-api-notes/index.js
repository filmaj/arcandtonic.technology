let arc = require('@architect/functions');
let url = arc.http.helpers.url;
let data = require('@architect/data');
let auth = require('@architect/shared/middleware/auth');
let bodyParser = require('@architect/shared/middleware/body-parser');
let responder = require('@architect/shared/responder');
let logger = require('@architect/shared/logger')('POST /api/notes');
let Hashids = require('hashids');
let hashids = new Hashids();

async function route (req) {
  let session = await arc.http.session.read(req);
  let payload = req.body;
  if (!payload || !payload.note) {
    return responder(req, {
      statusCode: 400,
      body: {error: 'empty request body or note property'}
    });
  }
  let note = {
    accountID: session.account.accountID,
    noteID: hashids.encode(Date.now()),
    note: payload.note
  };
  try {
    // save the note
    await data.notes.put(note);
  } catch (e) {
    logger(`Exception saving ${session.account.accountID}'s note! ${e.message}`);
    return responder(req, {
      statusCode: 500,
      body: {error: e.message}
    });
  }
  logger(`${note.accountID} created a note`);
  return responder(req, {
    statusCode: 200,
    headers: {
      'set-cookie': await arc.http.session.write(session),
      location: url('/')
    },
    body: note
  });
}

exports.handler = arc.middleware(auth, bodyParser, route);
