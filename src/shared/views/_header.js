let arc = require('@architect/functions');
let url = arc.http.helpers.url;

module.exports = function _header (session, path) {
    let body = ``;
    if (session && session.account && session.account.accountID) {
        body = `
  <div class=card-body>
    <a href=${url('/')}>Home</a>
    <form action=${url('/logout')} method=post>
      <button type=submit class="btn btn-primary float-right m-4">Logout</button>
    </form>
  </div>`;
    } else if (!path.includes('/signup')) {
        body = `
  <div class=card-body>

    <form action=${url('/login')} method=post>
      <div class=form-group>
        <label for=email>Email address</label>
        <input type=email class=form-control name=email placeholder="Enter email">
      </div>
      <div class=form-group>
        <label for=password>Password</label>
        <input type=password class=form-control name=password placeholder="Password">
      </div>
      <button type=submit class="btn btn-primary float-left">Login</button>
    </form>
    <p class=float-right>or <a href=${url('/signup')}>Sign Up</a></p>
  </div>`;
    }
    if (body.length) {
        return `<div class="card mt-5 mr-auto ml-auto mb-1 w-25">${body}</div>`;
    } else {
        return ``;
    }
};
