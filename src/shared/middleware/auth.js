let arc = require('@architect/functions');
let url = arc.http.helpers.url;
let responder = require('../responder');

module.exports = async function (req) {
  let session;
  try {
    session = await arc.http.session.read(req);
  } catch (e) {
    // eslint-disable-next-line
    console.error(`[auth middleware] Exception caught:`, e);
    responder(req, {statusCode: 500,
      body: {error: e.message}});
  }
  // if the current session is not logged in boot back to login page
  // TODO: would be nice to make this accept-header aware, such that different
  // response is given for application/json vs. text/html
  // TODO: would be nice to also have the app forward to the location it came
  // from when it hit authorization
  if (!session || !session.account) {
    return {
      statusCode: 302,
      headers: {
        location: url(`/login?error=${encodeURI('Please login to proceed!')}`)
      }
    };
  }
};
