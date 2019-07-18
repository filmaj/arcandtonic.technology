module.exports = function ({title, root, notes, accountID}) {
  title = title || 'Arc and Tonic';
  notes = notes || [];
  accountID = accountID || '';
  root = root || '/';
  return `<!DOCTYPE html>
<html lang=en>
  <head>
    <meta charset=utf-8>
    <meta name=viewport content=width=device-width,initial-scale=1,shrink-to-fit=no>
    <title>${title}</title>
    <link href=_static/css/tonic.css rel=stylesheet />
  </head>
  <body style="font-family: var(--tonic-body)">
    <arc-tonic id=app user="${accountID}" notes='${JSON.stringify(notes)}' id=app></arc-tonic>
    <script type=text/javascript>ROOT = '${root}';</script>
    <script type=module crossorigin>
        import Tonic from './_static/js/tonic.mjs';
        import TonicComponents from './_static/js/tonic-components.mjs';
        TonicComponents(Tonic);
    </script>
    <script src=${root}_static/js/ArcTonic.mjs type=module crossorigin></script>
  </body>
</html>`;
};
