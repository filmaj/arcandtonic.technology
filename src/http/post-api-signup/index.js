let promisify = require('util').promisify;
let arc = require('@architect/functions');
let responder = require('@architect/shared/responder');
let bodyParser = require('@architect/shared/middleware/body-parser');
let logger = require('@architect/shared/logger')('POST /api/signup');
let hash = promisify(require('bcryptjs').hash);
let salt_rounds = 12;

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
  let email = req.body ? req.body.email : null;
  if (!email || !email.length) {
    return responder(req, {
      statusCode: 400,
      body: {error: 'No email provided!'}
    });
  }
  let password = req.body ? req.body.password : null;
  if (!password || !password.length) {
    return responder(req, {
      statusCode: 400,
      body: {error: 'No password provided!'}
    });
  }
  // test if account already exists
  let data
  try {
    data = await arc.tables();
    let account = await data.accounts.get({accountID: email});
    if (account && account.accountID === email) {
      return responder(req, {
        statusCode: 400,
        body: {error: 'Email already registered!'}
      });
    }
  } catch (e) {
    let msg = `Exception during arc.tables or data.accounts.get: ${e.message}`;
    logger(msg);
    return responder(req, {statusCode: 500,
      body: {error: msg}});
  }
  // create the account
  let hashed
  try {
    hashed = await hash(password, salt_rounds);
  } catch (e) {
    let msg = `Exception during password hashing: ${e.message}`;
    logger(msg);
    return responder(req, {statusCode: 500,
      body: {error: msg}});
  }
  let account = {accountID: email,
    hash: hashed};
  try {
    let result = await data.accounts.put(account);
    if (result && result.accountID) {
      delete result.hash;
      session.account = account;
    } else {
      let msg = `Error during account creation, unexpected result from database: ${result}`;
      logger(msg);
      return responder(req, {statusCode: 500,
        body: {error: msg}});
    }
  } catch (e) {
    let msg = `Exception during data.accounts.put: ${e.message}`;
    logger(msg);
    return responder(req, {statusCode: 500,
      body: {error: msg}});
  }
  logger(`${account.accountID} created`);
  return responder(req, {
    statusCode: 200,
    headers: {
      'set-cookie': await arc.http.session.write(session),
      location: arc.http.helpers.url('/')
    },
    body: account
  });
}

exports.handler = arc.http.middleware(bodyParser, route);
