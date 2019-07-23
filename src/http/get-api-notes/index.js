let arc = require('@architect/functions');
let responder = require('@architect/shared/responder');
let auth = require('@architect/shared/middleware/auth');
let bodyParser = require('@architect/shared/middleware/body-parser');
let logger = require('@architect/shared/logger')('GET /api/notes');

async function route (req) {
  let session;
  try {
    session = await arc.http.session.read(req);
  } catch (e) {
    let msg = `Error during session reading: ${e.message}`;
    logger(msg);
    return responder(req, {statusCode: 500,
      body: {error: msg}});
  }
  let accountID = session.account.accountID;
  let all;
  try {
    let data = await arc.tables();
    all = await data.notes.query({
      KeyConditionExpression: 'accountID = :accountID',
      ExpressionAttributeValues: {
        ':accountID': accountID
      }
    });
  } catch (e) {
    let msg = `Exception during arc.tables or data.notes.query: ${e.message}`;
    logger(msg);
    return responder(req, {statusCode: 500,
      body: {error: msg}});
  }
  let notes = all.Items;
  logger(`${accountID} retrieved ${notes.length} notes`);
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': await arc.http.session.write(session)
    },
    body: JSON.stringify(notes)
  };
}

exports.handler = arc.http.middleware(auth, bodyParser, route);
