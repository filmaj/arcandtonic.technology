let promisify = require('util').promisify;
let arc = require('@architect/functions');
let url = arc.http.helpers.url;
let data = require('@architect/data');
let responder = require('@architect/shared/responder');
let bodyParser = require('@architect/shared/middleware/body-parser');
let logger = require('@architect/shared/logger')('POST /api/signup');
let hash = promisify(require('bcryptjs').hash);
let salt_rounds = 12;

async function route (req) {
  logger('start of signup!');
  let session;
  try {
    session = await arc.http.session.read(req);
  } catch (e) {
    return responder(req, {
      statusCode: 500,
      body: {error: e.message}
    });
  }
  logger(JSON.stringify(req));
  let email = req.body.email;
  if (!email || !email.length) {
    return responder(req, {
      statusCode: 400,
      body: {error: 'no email provided'}
    });
  }
  // test if account already exists
  try {
    let account = await data.accounts.get({accountID: email});
    if (account && account.accountID === email) {
      return responder(req, {
        statusCode: 400,
        body: {error: 'email already registered'}
      });
    }
  } catch (e) {
    return responder(req, {
      statusCode: 500,
      body: {error: e.message}
    });
  }
  // create the account
  let password = req.body.password;
  let hashed = await hash(password, salt_rounds);
  let account = {accountID: email,
    hash: hashed};
  try {
    let result = await data.accounts.put(account);
    if (result && result.accountID) {
      delete result.hash;
      session.account = account;
    } else {
      return responder(req, {
        statusCode: 500,
        body: {error: 'error during account creation, got unexpected result from db',
          result}
      });
    }
  } catch (e) {
    logger(`Exception! ${e.message}`);
    return responder(req, {
      statusCode: 500,
      body: {error: e.message}
    });
  }
  logger(`${account.accountID} created `);
  let kook = await arc.http.session.write(session);
  return responder(req, {
    statusCode: 200,
    headers: {
      'set-cookie': kook,
      location: url('/')
    },
    body: account
  });
}

exports.handler = arc.middleware(bodyParser, route);
