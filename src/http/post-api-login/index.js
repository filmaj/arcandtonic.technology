let promisify = require('util').promisify;
let arc = require('@architect/functions');
let responder = require('@architect/shared/responder');
let bodyParser = require('@architect/shared/middleware/body-parser');
let logger = require('@architect/shared/logger')('POST /api/login');
let compare = promisify(require('bcryptjs').compare);

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
  if (!req.body || !req.body.email || req.body.email.length === 0) {
    return responder(req, {
      statusCode: 400,
      body: {error: 'No request body or email provided!'}
    });
  }
  if (!req.body.password || req.body.password.length === 0) {
    return responder(req, {
      statusCode: 400,
      body: {error: 'No password provided!'}
    });
  }
  let account, authorized;
  try {
    let data = await arc.tables();
    let result = await data.accounts.query({
      KeyConditionExpression: 'accountID = :accountID',
      ExpressionAttributeValues: {
        ':accountID': req.body.email
      }
    });
    if (result && result.Items && result.Items.length) {
      account = result.Items.filter((item) => item.accountID === req.body.email)[0];
      let stored = account.hash;
      authorized = await compare(req.body.password, stored);
    }
  } catch (e) {
    let msg = `Exception during data retrieval! ${e.message}`;
    logger(msg);
    return responder(req, {
      statusCode: 500,
      body: {error: msg}
    });
  }
  if (authorized) {
    delete account.hash;
    session.account = account;
    logger(`${account.accountID} logged in`);
    return responder(req, {
      statusCode: 200,
      headers: {
        'set-cookie': await arc.http.session.write(session),
        location: arc.http.helpers.url('/')
      },
      body: account
    });
  }
  logger(`Invalid login attempt for ${req.body.email}`);
  return responder(req, {
    statusCode: 401,
    body: {error: 'Invalid email or password!'}
  });
}

exports.handler = arc.http.middleware(bodyParser, route);
