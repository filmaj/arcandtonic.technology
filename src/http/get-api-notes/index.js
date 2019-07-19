let arc = require('@architect/functions');
let data = require('@architect/data');
let auth = require('@architect/shared/middleware/auth');
let bodyParser = require('@architect/shared/middleware/body-parser');
let logger = require('@architect/shared/logger')('GET /api/notes');

async function route (req) {
  let session = await arc.http.session.read(req);
  let accountID = session.account.accountID;
  let all = await data.notes.query({
    KeyConditionExpression: 'accountID = :accountID',
    ExpressionAttributeValues: {
      ':accountID': accountID
    }
  });
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

exports.handler = arc.middleware(auth, bodyParser, route);
