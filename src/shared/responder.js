let qs = require('querystring');
let url = require('url');

// handles filling out responses based on accept request headers
// formats response to be text/html friendly, or json friendly
module.exports = function (req, res) {
  let types = req.headers.accept ? req.headers.accept.split(',') : ['application/json'];
  let htmlIdx = types.indexOf('text/html');
  let jsonIdx = types.indexOf('application/json');
  let type = 'application/json';
  // which format does the client want?
  if (htmlIdx > -1) {
    if (jsonIdx > -1) {
      if (htmlIdx < jsonIdx) type = 'text/html';
    } else type = 'text/html';
  }
  res.headers = res.headers || {};
  res.headers['content-type'] = type;
  switch (type) {
    case 'text/html': {
      let next = url.parse(res.headers.location ? res.headers.location : req.headers.referer);
      let path = next.path;
      res.headers.location = path;
      res.statusCode = 302;
      if (res.body) {
        res.headers.location += (next.search && next.search.length ? '&' : '?') + qs.stringify(res.body);
        delete res.body;
      }
      break;
    }
    case 'application/json':
    default: {
      if (res.body) res.body = JSON.stringify(res.body);
      break;
    }
  }
  return res;
};
