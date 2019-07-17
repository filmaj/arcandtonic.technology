let arc = require('@architect/functions');
let url = arc.http.helpers.url;

exports.handler = async function (req) {
  let session = await arc.http.session.read(req);
  delete session.account;
  return {
    status: 302,
    cookie: await arc.http.session.write(session),
    location: url('/')
  };
};
