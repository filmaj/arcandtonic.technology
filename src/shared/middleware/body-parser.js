let qs = require('querystring');

const JSON_TYPES = ['application/json'];
const FORM_TYPES = ['application/x-www-form-urlencoded'];
const WILL_PARSE = JSON_TYPES.concat(FORM_TYPES);

module.exports = function (req) {
  if (!req.body || typeof req.body === 'object') return;
  let type = req.headers['content-type'];

  if (WILL_PARSE.includes(type)) {
    let parsed;
    if (JSON_TYPES.includes(type)) {
      try {
        parsed = JSON.parse(req.body)
      } catch (e) {
        // eslint-disable-next-line
        console.error(`[body-parser middleware] Exception while parsing JSON!`, e);
        return {
          statusCode: 400,
          headers: {'content-type': JSON_TYPES[0]},
          body: JSON.stringify({error: e.message})
        };
      }
    } else if (FORM_TYPES.includes(type)) {
      if (req.isBase64Encoded) {
        try {
          let b64 = Buffer.from(req.body, 'base64').toString();
          parsed = qs.parse(b64);
        } catch (e) {
          // eslint-disable-next-line
          console.error(`[body-parser middleware] Exception while parsing base64 encoded body!`, e);
          return {
            statusCode: 400,
            headers: {'content-type': 'text/html'},
            body: JSON.stringify({error: e.message})
          };
        }
      } else {
        parsed = qs.parse(req.body);
      }
    }
    req.body = parsed;
    return req;
  }
};
