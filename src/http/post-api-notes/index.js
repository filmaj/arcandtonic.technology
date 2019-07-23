let arc = require('@architect/functions');
let auth = require('@architect/shared/middleware/auth');
let bodyParser = require('@architect/shared/middleware/body-parser');
let responder = require('@architect/shared/responder');
let logger = require('@architect/shared/logger')('POST /api/notes');
let Hashids = require('hashids');
let hashids = new Hashids();

async function route (req) {
  let session;
  try {
    session = await arc.http.session.read(req);
  } catch (e) {
    let msg = `Error during session read: ${e.message}`;
    logger(msg);
    return responder(req, {statusCode: 500,
      body: {error: msg}});
  }
  let payload = req.body;
  if (!payload || !payload.note) {
    return responder(req, {statusCode: 400,
      body: {error: 'Empty request body or note property!'}});
  }
  let note = {
    accountID: session.account.accountID,
    noteID: hashids.encode(Date.now()),
    note: payload.note
  };
  try {
    let data = await arc.tables();
    // save the note
    await data.notes.put(note);
  } catch (e) {
    let msg = `Exception saving note! ${e.message}`;
    logger(msg);
    return responder(req, {statusCode: 500,
      body: {error: msg}});
  }
  logger(`${note.accountID} created a note`);
  return responder(req, {
    statusCode: 200,
    headers: {
      'set-cookie': await arc.http.session.write(session),
      location: arc.http.helpers.url('/')
    },
    body: note
  });
}

exports.handler = arc.http.middleware(auth, bodyParser, route);
