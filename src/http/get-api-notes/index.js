let arc = require('@architect/functions');
let data = require('@architect/data');
let auth = require('@architect/shared/middleware/auth');

async function route (req) {
    let session = await arc.http.session.read(req);
    let accountID = session.account.accountID;
    let all = await data.notes.query({
        KeyConditionExpression: 'accountID = :accountID',
        ExpressionAttributeValues: {
            ':accountID': accountID
        }
    });

    // add href to each note for the template link
    let notes = all.Items.map(function addHref (note) {
        note.href = url(`/notes/${note.noteID}`);
        return note;
    });
    return {
        status: 200,
        type: 'application/json',
        cookie: await arc.http.session.write(session),
        body: JSON.stringify(notes)
    };
}

exports.handler = arc.middleware(auth, route);
