let arc = require('@architect/functions');
let data = require('@architect/data');
let url = arc.http.helpers.url;
let error = require('@architect/shared/http_error');
let compare = require('bcryptjs').compareSync;

exports.handler = async function login (req) {
    let session = await arc.http.session.read(req);
    try {
        let result = await data.accounts.query({
            KeyConditionExpression: 'accountID = :accountID',
            ExpressionAttributeValues: {
                ':accountID': req.body.email
            }
        });
        if (result && result.Items && result.Items.length) {
            let account = result.Items.filter((item) => item.accountID === req.body.email)[0];
            let stored = account.hash;
            let authorized = compare(req.body.password, stored);
            if (authorized) {
                delete account.hash;
                session.account = account;
                console.log(session.account.accountID, 'logged in');
                return {
                    status: 200,
                    type: 'application/json',
                    cookie: await arc.http.session.write(session),
                    body: JSON.stringify(account)
                };
            }
        }
    } catch (e) {
        return error(e);
    }
    return error({message: 'not authorized'});
};
