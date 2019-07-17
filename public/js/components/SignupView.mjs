import Tonic from '../tonic.mjs';
export default class SignupView extends Tonic {
  render () {
    return `<div>
  <h2>Create an Account</h2>
  <p>todo: figure out how to communicate errors</p>
  <form action=/api/signup method=post>
    <tonic-input
      label="Email Address"
      type=email
      id=email
      name=email
      required=true
      placeholder="Enter a valid email address"
      spellcheck=false
      error-message="Invalid Email">
    </tonic-input>
    <tonic-input
      label=Password
      type=password
      id=password
      name=password
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
  click (evt) {
    if (Tonic.match(evt.target, 'tonic-button#submit')) {
      const email_input = this.root.querySelector('#email');

      if (email_input.value.length === 0) {
        alert('email cannot be empty!');
        evt.preventDefault();
        return;
      }
      const password = this.root.querySelector('#password');
      const confirm = this.root.querySelector('#confirm');
      if (password.value !== confirm.value) {
        alert('passwords must match!');
        evt.preventDefault();
      }
    }
  }
}
Tonic.add(SignupView);
