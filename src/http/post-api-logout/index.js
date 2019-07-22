let arc = require('@architect/functions');

exports.handler = async function (req) {
  let session = await arc.http.session.read(req);
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
