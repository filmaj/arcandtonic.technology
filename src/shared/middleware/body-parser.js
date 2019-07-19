let typeis = require('type-is');
let qs = require('querystring');

const JSON_TYPES = ['application/json'];
const FORM_TYPES = ['application/x-www-form-urlencoded'];

module.exports = function (req) {
  if (!typeis.hasBody(req) || typeof req.body === 'object') return;
  let parsed;

  if (typeis(req, JSON_TYPES)) {
    try {
      parsed = JSON.parse(req.body)
    } catch (e) {
      return {
        statusCode: 400,
        headers: {'content-type': JSON_TYPES[0]},
        body: JSON.stringify({error: e.message})
      };
    }
  } else if (typeis(req, FORM_TYPES)) {
    let b64 = Buffer.from(req.body, 'base64').toString();
    try {
      parsed = qs.parse(b64);
    } catch (e) {
      return {
        statusCode: 400,
        headers: {'content-type': 'text/html'},
        body: JSON.stringify(e, null, 2)
      };
    }
  }
  req.body = parsed;
  return req;
};
