import Tonic from '../tonic.mjs';
export default class LoginView extends Tonic {
  render () {
    return `
        <div>
          <h2>Log In</h2>
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
      if (email_input.value.length === 0) {
        alert('email cannot be empty!');
        evt.preventDefault();
        return;
      }
      const password = this.root.querySelector('#login_password');
      if (password.value.length === 0) {
        alert('password cannot be empty!');
        evt.preventDefault();
      }
    }
  }
}
Tonic.add(LoginView);
