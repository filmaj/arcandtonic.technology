import Tonic from '../tonic.mjs';
export default class Signup extends Tonic {
    render () {
        return `
        <div>
          <h2>Create an Account</h2>
          <p>todo: figure out how to communicate errors</p>
          <form>
              <tonic-input
                  label="Email Address"
                  type=email
                  id=email
                  placeholder="Enter a valid email address"
                  spellcheck=false
                  error-message="Invalid Email">
              </tonic-input>
              <tonic-input
                  label=Password
                  type=password
                  id=password
                  placeholder="Enter a password"
                  spellcheck=false>
              </tonic-input>
              <tonic-input
                  label="Confirm Password"
                  type=password
                  id=confirm
                  placeholder="Confirm your password"
                  spellcheck=false>
              </tonic-input>
              <tonic-button async=true id=submit>
                  Submit
              </tonic-button>
          </form>
        </div>`;
    }
    async click (evt) {
        if (Tonic.match(evt.target, 'tonic-button#submit')) {
            evt.preventDefault();
            const email_input = this.root.querySelector('#email');

            if (email_input.value.length === 0) {
                alert('email cannot be empty!');
                return;
            }
            const password = this.root.querySelector('#password');
            const confirm = this.root.querySelector('#confirm');
            if (password.value !== confirm.value) {
                alert('passwords must match!');
                return;
            }
            const submit = this.root.querySelector('#submit');
            try {
                let result = await fetch(`/api/signup`, {
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: email_input.value,
                        password: password.value
                    })
                });
                if (result && result.ok) {
                    submit.loading(false);
                    let account = await result.json();
                    document.getElementById('app').reRender({user: account.accountID});
                    window.history.pushState({}, 'Home', '/');
                } else {
                    // TODO error
                    console.error('yuh oh!', result)
                }
            } catch (e) {
                // TODO: error
                console.error('error!', e);
            }
        }
    }
}
Signup.el = 'Signup';
Tonic.add(Signup);
