let arc = require('@architect/functions');
let url = arc.http.helpers.url;

module.exports = async function (req) {
  let session = await arc.http.session.read(req);
  // if the current session is not logged in boot back to login page
  // TODO: would be nice to make this accept-header aware, such that different
  // response is given for application/json vs. text/html
  if (!session || !session.account) {
    return {
      statusCode: 302,
      headers: {
        location: url('/login?error=please%20login%20to%20proceed')
      }
    };
  }
};
