let arc = require('@architect/functions');
let url = arc.http.helpers.url;

module.exports = function layout (params = {}) {
    let title = params.title || 'arc data persistence, auth and js module frontend powered by tonic';
    let session = params.session;
    let user = session.account ? session.account.accountID : '';
    return `
<!DOCTYPE html>
<html lang=en>
  <head>
    <meta charset=utf-8>
    <meta name=viewport content=width=device-width,initial-scale=1,shrink-to-fit=no>
    <title>${title}</title>
    <link href=${url('css/tonic.css')} rel=stylesheet />
  </head>
  <body style="font-family: var(--body)">
    <App user="${user}" id=app></App>
    <script type=text/javascript>BASE_URL="${url('/')}";</script>
    <script type=module crossorigin>
        import Tonic from './${url('js/tonic.mjs')}';
        import TonicComponents from './${url('js/tonic-components.mjs')}';
        TonicComponents(Tonic);
    </script>
    <script src=${url('js/app.mjs')} type=module crossorigin></script>
  </body>
</html>
`;
};
