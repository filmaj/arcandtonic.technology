let promisify = require('util').promisify;
let arc = require('@architect/functions');
let url = arc.http.helpers.url;
let data = require('@architect/data');
let responder = require('@architect/shared/responder');
let hash = promisify(require('bcryptjs').hash);
let salt_rounds = 12;

exports.handler = async function (req) {
  let session = await arc.http.session.read(req);
  let email = req.body.email;
  if (!email || !email.length) {
    return responder(req, {
      status: 400,
      body: {error: 'no email provided'}
    });
  }
  // test if account already exists
  try {
    let account = await data.accounts.get({accountID: email});
    if (account && account.accountID === email) {
      return responder(req, {
        status: 400,
        body: {error: 'email already registered'}
      });
    }
  } catch (e) {
    return responder(req, {
      status: 500,
      body: e
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
        status: 500,
        body: {error: 'error during account creation, got unexpected result from db',
          result}
      });
    }
  } catch (e) {
    return responder(req, {
      status: 500,
      body: e
    });
  }
  console.log(account.accountID, 'created');
  return responder(req, {
    status: 200,
    cookie: await arc.http.session.write(session),
    body: account,
    location: url('/')
  });
};
