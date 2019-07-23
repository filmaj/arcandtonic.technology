let arc = require('@architect/functions');
let auth = require('@architect/shared/middleware/auth');
let responder = require('@architect/shared/responder');
let logger = require('@architect/shared/logger')('POST /api/notes/<id>/del');

async function route (req) {
  let noteID = req.params.noteID;
  let session = await arc.http.session.read(req);
  let accountID = session.account.accountID;
  try {
    let data = await arc.tables();
    await data.notes.delete({
      noteID,
      accountID
    });
  } catch (e) {
    logger(`Exception! ${e.message}`);
    return responder(req, {
      statusCode: 500,
      body: {error: e.message}
    });
  }
  logger(`${noteID} deleted`);
  return responder(req, {
    statusCode: 302,
    headers: {
      'set-cookie': await arc.http.session.write(session),
      location: arc.http.helpers.url('/')
    }
  });
}

exports.handler = arc.http.middleware(auth, route);
