let arc = require('@architect/functions');
let data = require('@architect/data');
let auth = require('@architect/shared/middleware/auth');
let responder = require('@architect/shared/responder');
let url = arc.http.helpers.url;

async function route (req) {
  let noteID = req.params.noteID;
  let session = await arc.http.session.read(req);
  let accountID = session.account.accountID;
  try {
    await data.notes.delete({
      noteID,
      accountID
    });
  } catch (e) {
    return responder(req, {
      status: 500,
      body: e
    });
  }
  return responder(req, {
    status: 302,
    cookie: await arc.http.session.write(session),
    location: url('/')
  });
}

exports.handler = arc.middleware(auth, route);
