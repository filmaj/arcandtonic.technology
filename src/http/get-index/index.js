let arc = require('@architect/functions');
let url = arc.http.helpers.url;
let data = require('@architect/data');
let layout = require('@architect/shared/layout');
let logger = require('@architect/shared/logger')('GET /');

exports.handler = async function (req) {
  let params = {
    title: 'Arc and Tonic',
    root: url('/')
  };
  let cookie, session;
  try {
    session = await arc.http.session.read(req);
    if (session.account && session.account.accountID) {
      let accountID = session.account.accountID;
      cookie = await arc.http.session.write(session);
      params.accountID = accountID;
      let all = await data.notes.query({
        KeyConditionExpression: 'accountID = :accountID',
        ExpressionAttributeValues: {
          ':accountID': accountID
        }
      });
      params.notes = all.Items;
    }
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        'content-type': 'text/html'
      },
      body: JSON.stringify(e)
    }
  }
  logger(`200 ${params.accountID ? `(${params.accountID})` : ''}`);
  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/html',
      'set-cookie': cookie
    },
    body: layout(params)
  };
}
