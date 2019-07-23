let arc = require('@architect/functions');
let logger = require('@architect/shared/logger')('POST /api/logout');
let responder = require('@architect/shared/responder');

exports.handler = async function (req) {
  let session;
  try {
    session = await arc.http.session.read(req);
  } catch (e) {
    let msg = `Error during session reading: ${e.message}`;
    logger(msg);
    return responder(req, {statusCode: 500,
      body: {error: msg}});
  }
  delete session.account;
  // TODO: how would this work if accept=application/json ?
  return {
    statusCode: 302,
    headers: {
      'set-cookie': await arc.http.session.write(session),
      location: arc.http.helpers.url('/')
    }
  };
};
