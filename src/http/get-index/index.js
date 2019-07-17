let arc = require('@architect/functions');
let data = require('@architect/data');
let layout = require('@architect/shared/layout');
let logger = require('@architect/shared/logger')('GET /');

exports.handler = async function (req) {
  let params = {title: 'Arc And Tonic'};
  let session = await arc.http.session.read(req);
  let cookie = null;
  if (session.account && session.account.accountID) {
    let accountID = session.account.accountID;
    cookie = await arc.http.session.write(session);
    logger(`${accountID} is logged in`);
    params.accountID = accountID;
    let all = await data.notes.query({
      KeyConditionExpression: 'accountID = :accountID',
      ExpressionAttributeValues: {
        ':accountID': accountID
      }
    });
    params.notes = all.Items;
  }
  return {
    status: 200,
    type: 'text/html',
    cookie,
    body: layout(params)
  };
}
