let promisify = require('util').promisify;
let arc = require('@architect/functions');
let responder = require('@architect/shared/responder');
let bodyParser = require('@architect/shared/middleware/body-parser');
let logger = require('@architect/shared/logger')('POST /api/login');
let compare = promisify(require('bcryptjs').compare);

async function route (req) {
  let session = await arc.http.session.read(req);
  if (!req.body || !req.body.email || req.body.email.length === 0) {
    return responder(req, {
      statusCode: 400,
      body: {error: 'no email provided'}
    });
  }
  if (!req.body.password || req.body.password.length === 0) {
    return responder(req, {
      statusCode: 400,
      body: {error: 'no password provided'}
    });
  }
  try {
    let data = await arc.tables();
    let result = await data.accounts.query({
      KeyConditionExpression: 'accountID = :accountID',
      ExpressionAttributeValues: {
        ':accountID': req.body.email
      }
    });
    if (result && result.Items && result.Items.length) {
      let account = result.Items.filter((item) => item.accountID === req.body.email)[0];
      let stored = account.hash;
      let authorized = await compare(req.body.password, stored);
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
    }
  } catch (e) {
    logger(`Exception! ${e.message}`);
    return responder(req, {
      statusCode: 500,
      body: {error: e.message}
    });
  }
  logger(`Unauthorized login attempt for ${req.body.email}`);
  return responder(req, {
    statusCode: 401,
    body: {error: 'not authorized'}
  });
}

exports.handler = arc.middleware(bodyParser, route);
