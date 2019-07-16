import Tonic from '../tonic.mjs';
export default class Login extends Tonic {
    render () {
        return `
        <div>
          <h2>Log In</h2>
          <form>
              <tonic-input
                  label="Email Address"
                  type=email
                  id=login_email
                  placeholder="Enter your email address"
                  spellcheck=false
                  error-message="Invalid Email">
              </tonic-input>
              <tonic-input
                  label=Password
                  type=password
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
    async click (evt) {
        if (Tonic.match(evt.target, 'tonic-button#login_submit')) {
            evt.preventDefault();
            const email_input = this.root.querySelector('#login_email');

            if (email_input.value.length === 0) {
                alert('email cannot be empty!');
                return;
            }
            const password = this.root.querySelector('#login_password');
            const submit = this.root.querySelector('#login_submit');
            try {
                let result = await fetch(`api/login`, {
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: email_input.value,
                        password: password.value
                    })
                });
                console.log('fetch result', result);
                if (result && result.ok) {
                    submit.loading(false);
                    window.location.href = BASE_URL;
                } else {
                    // TODO error
                }
            } catch (e) {
                // TODO: error
                console.error('error!', e);
            }
        }
    }
}
Login.el = 'Login';
Tonic.add(Login);
