import Tonic from '../tonic.mjs';
export default class LoginView extends Tonic {
  render () {
    let qs = document.location.search;
    let error = null;
    if (qs.length) {
      let params = (new URL(document.location)).searchParams;
      if (params.has('error')) error = params.get('error')
    }
    return `
        <div>
          <h2>Log In</h2>
          <tonic-toaster-inline id=error-toast type=danger dismiss=true
            display=${error ? 'true' : 'false'}>
            ${error}
          </tonic-toaster-inline>
          <form action=/api/login method=post>
            <tonic-input
              label="Email Address"
              type=email
              name=email
              id=login_email
              placeholder="Enter your email address"
              spellcheck=false
              error-message="Invalid Email">
            </tonic-input>
            <tonic-input
              label=Password
              type=password
              name=password
              id=login_password
              placeholder="Enter your password"
              spellcheck=false>
            </tonic-input>
            <tonic-button async=true id=login_submit>
              Log In
            </tonic-button>
          </form>
        </div>`;
  }
  click (evt) {
    if (Tonic.match(evt.target, 'tonic-button#login_submit')) {
      const email_input = this.root.querySelector('#login_email');
      const submit = this.root.querySelector('#login_submit');
      if (!email_input.value || email_input.value.length === 0) {
        email_input.setInvalid('Email cannot be empty!');
        evt.preventDefault();
        submit.loading(false);
        return;
      }
      email_input.setValid();
      const password = this.root.querySelector('#login_password');
      if (!password.value || password.value.length === 0) {
        password.setInvalid('Password cannot be empty!');
        evt.preventDefault();
        submit.loading(false);
        return;
      }
      password.setValid();
    }
  }
}
Tonic.add(LoginView);
