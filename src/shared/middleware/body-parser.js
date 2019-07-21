let qs = require('querystring');

const JSON_TYPES = ['application/json'];
const FORM_TYPES = ['application/x-www-form-urlencoded'];
const WILL_PARSE = JSON_TYPES.concat(FORM_TYPES);

module.exports = async function (req) {
  if (!req.body || typeof req.body === 'object') return;
  console.log('body parser has a body to work with');
  let type = req.headers['content-type'];

  if (WILL_PARSE.includes(type)) {
    console.log('body parser will parse');
    let parsed;
    if (JSON_TYPES.includes(type)) {
      console.log('body parser will parse json');
      try {
        parsed = JSON.parse(req.body)
      } catch (e) {
        return {
          statusCode: 400,
          headers: {'content-type': JSON_TYPES[0]},
          body: JSON.stringify({error: e.message})
        };
      }
    } else if (FORM_TYPES.includes(type)) {
      console.log('body parser will parse form');
      try {
        let b64 = Buffer.from(req.body, 'base64').toString();
        parsed = qs.parse(b64);
      } catch (e) {
        return {
          statusCode: 400,
          headers: {'content-type': 'text/html'},
          body: JSON.stringify(e, null, 2)
        };
      }
    }
    console.log('body parser setting body to', parsed);
    req.body = parsed;
    return req;
  }
};
