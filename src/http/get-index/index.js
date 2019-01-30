let arc = require('@architect/functions');

let data = require('@architect/data');
let layout = require('@architect/shared/layout');
let url = arc.http.helpers.url;
let form = require('./_form');

// TODO: fold this into frontend code
async function authorized (req) {
    let session = await arc.http.session.read(req);
    if (session && session.account) {
        // get all the notes
        let title = 'welcome home';
        let all = await data.notes.query({
            KeyConditionExpression: 'accountID = :accountID',
            ExpressionAttributeValues: {
                ':accountID': session.account.accountID
            }
        });

        // add href to each note for the template link
        let notes = all.Items.map(function addHref (note) {
            note.href = url(`/notes/${note.noteID}`);
            return note;
        });

        // disambiguate URLs for envs
        let createUrl = url('/notes');

        // interpolate the template data
        let body = form({url: createUrl});
        if (notes && notes.length) {
            body += `
    <div class="card mt-5 mr-auto ml-auto mb-1 w-25">
      <h2>Previous Notes</h2>
      ${notes.map(make_note).join('\n  ')}
    </div>`;
        }
        let html = layout({body, title, session, path: '/'});

        return {
            status: 200,
            type: 'text/html; charset=utf8',
            cookie: await arc.http.session.write(session),
            body: html
        };
    }
}

exports.handler = async function index (req) {
    let session = await arc.http.session.read(req);
    let html = layout({session});
    return {
        status: 200,
        type: 'text/html; charset=utf8',
        body: html
    };
}

function make_note ({title, body, href}) {
    return `
<div class="card mt-4 mr-auto ml-auto mb-1 w-25">
  <div class=card-header><a href=${href}>${title}</a></div>
  <div class=card-body>${body}</div>
</div>
`;
}
